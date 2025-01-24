import numpy as np
import logging

from typing import Optional, Tuple
from sqlalchemy.exc import SQLAlchemyError
from app.database import DatabaseManager
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import Ollama

from app.schemas.faq import FAQCreate
from app.database import FAQ

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatbotService:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        self.llm = Ollama(
            base_url="http://ollama:11434",
            model="llama3",
            temperature=0.7
        )

    async def process_question(self, question: str):
        """
        Returning the answer to the question by looking if the question is already between the faq questions.
        If not, it will use the Ollama model to generate an answer.
        Else it will return the answer from the database & update the last_asked time and frequency_asked.
        :param question: The question asked by the user
        :return: The answer to the question
        """

        try:
            language_detected = self.db_manager.detect_language(question)
            faq_match = self.find_matching_faq_question(question, language_detected)

            if faq_match:
                faq, similarity = faq_match
                logger.info(f"Returning answer from FAQ: {faq.answer}, that has a similarity of {similarity}.")
                self.db_manager.update_faq_statistics(faq.id)
                return {
                    "answer": faq.answer,
                    "source": "faq",
                    "confidence": similarity
                }

            logger.info("No matching FAQ question found, using Ollama to generate an answer.")
            answer = await self.generate_rag_response(question, language_detected)
            logger.info(f"Returning answer from Ollama: {answer} and adding it to the FAQ database.")
            self.db_manager.add_faq(
                FAQCreate(
                    question=question,
                    answer=answer,
                    language=language_detected
                )
            )

            return {
                "answer": answer,
                "source": "ollama",
                "confidence": None
            }
        except Exception as e:
            logger.error(f"Error processing question: {e}")
            raise

    def find_matching_faq_question(self, question: str, language: str, threshold: float = 0.90) -> Optional[Tuple[FAQ, float]]:
        """
        Find the matching FAQ Question in the database based on the similarity of the embeddings.
        If the similarity exceeds the threshold, the FAQ question will be returned
        :param question: The question asked by the user
        :param language: The language of the question
        :param threshold: The threshold for the similarity
        :return: The Optional FAQ question and the similarity
        """

        try:
            question_embedding = self.embeddings.embed_query(question)
            question_embedding_np = np.array(question_embedding)

            session = self.db_manager.get_db_session()
            try:
                faq_questions = session.query(FAQ).filter(FAQ.language == language).all()
                for faq in faq_questions:
                    faq.embedding = self.db_manager.deserialize_embedding(faq.embedding)
                logger.info(f"Found {len(faq_questions)} FAQ questions in the database")
                best_match = None
                highest_similarity = 0.0

                for faq in faq_questions:
                    faq_embedding_np = np.array(faq.embedding)
                    similarity = np.dot(question_embedding_np, faq_embedding_np) / (
                        np.linalg.norm(question_embedding_np) * np.linalg.norm(faq_embedding_np)
                    )

                    if similarity > highest_similarity:
                        highest_similarity = similarity
                        best_match = faq

                if highest_similarity >= threshold:
                    logger.info(f"Found matching FAQ question: {best_match.question}")
                    return best_match, highest_similarity

                logger.info(f"No matching FAQ question found for {question}")
                return None

            except SQLAlchemyError as e:
                logger.error(f"Error finding matching FAQ question: {e}")
                raise

            finally:
                logger.info("Closing the session")
                session.close()

        except Exception as e:
            logger.error(f"Error finding matching FAQ question: {e}")
            raise

    async def generate_rag_response(self, question: str, language: str) -> str:
        """
        Generate a response using RAG by:
        1. Finding relevant rules from the database using embedding similarity.
        2. Formatting a prompt with the retrieved context.
        3. Generating a response using the Ollama model.
        :param question: The question asked by the user
        :param language: The detected language of the question
        :return: The generated Answer from the Ollama model
        """

        try:
            logger.info("Starting to generate a response using RAG")
            question_embedding = self.embeddings.embed_query(question)
            question_embedding_np = np.array(question_embedding)

            try:
                rules = self.db_manager.get_rules_with_embeddings(language=language)
                logger.info(f"Found {len(rules)} rules in the database for the language {language}")

                if not rules:
                    logger.warning("No rules found in the database for the specified language.")
                    return self.get_no_rules_message(language)

                similarities = []
                for rule in rules:
                    rule_embedding_np = np.array(rule.embedding)
                    similarity = np.dot(question_embedding_np, rule_embedding_np) / (
                        np.linalg.norm(question_embedding_np) * np.linalg.norm(rule_embedding_np)
                    )
                    similarities.append((rule, similarity))

                relevant_rules = sorted(similarities, key=lambda x: x[1], reverse=True)[:2]
                logger.info(f"Found {len(relevant_rules)} relevant rules for the question")
                max_similarity = relevant_rules[0][1] if relevant_rules else 0.0
                if max_similarity < 0.4:
                    logger.info(f"Question appears to be off-topic with a similarity of {max_similarity}")
                    return self.get_off_topic_message(language)

                context = "\n\n".join([rule.text for rule, _ in relevant_rules])
                prompt = await self.format_prompt(context, language, question)

                logger.info("Generating response using the llama3 model.")
                response = await self.llm.agenerate([prompt])
                answer = response.generations[0][0].text.strip()
                logger.info(f"Generated response: {answer}")

                return answer

            except Exception as e:
                logger.error(f"Error generating response using RAG: {e}")
                raise
        except Exception as e:
            logger.error(f"Error generating response using RAG: {e}")
            raise

    @staticmethod
    async def format_prompt(context: str, language: str, question: str) -> str:
        """
        Format the prompt for the Ollama model by adding the context and the language.
        :param question: The question asked by the user
        :param context: The context of the question retrieved from the database by using similarity search.
        :param language: The language of the question
        :return: The formatted prompt
        """
        if language == "nl":
            prompt = f"""
            Gebaseerd op de volgende spelregels: {context}.
            Beantwoord de volgende vraag over de regels op een duidelijke en beknopte manier: {question}.
            Verwijs alleen naar informatie die in de bovenstaande regels staan.
            Als het antwoord niet direct uit de regels blijkt, geef dan aan dat je het antwoord niet met zekerheid kan geven.
            """
        else:
            prompt = f"""
            Based on the following rules: {context}.
            Answer the following question about the rules in a clear and concise manner: {question}.
            Only refer to information that is in the above rules.
            If the answer is not directly in the rules, indicate that you cannot give the answer with certainty.
            """
        logger.info(f"Done formatting the prompt: {prompt}")
        return prompt

    @staticmethod
    def get_off_topic_message(language: str) -> str:
        messages = {
            "nl": "Zou je je vraag kunnen herformuleren of meer context kunnen geven? "
                  "Ik kon geen spelregels vinden die relevant zijn voor je vraag. "
                  "Ik ben hier om je te helpen met vragen over de spelregels.",
            "en": "Could you please rephrase your question or provide more context? "
                  "I couldn't find any game rules relevant to your question. "
                  "I'm here to help you with questions about the game rules."
        }
        return messages.get(language, messages["en"])

    @staticmethod
    def get_no_rules_message(language: str) -> str:
        messages = {
            "nl": "Er zijn momenteel geen spelregels beschikbaar in deze taal. "
                  "Probeer het alsjeblieft in een andere taal.",
            "en": "There are currently no game rules available in this language. "
                  "Please try in a different language."
        }
        return messages.get(language, messages["en"])