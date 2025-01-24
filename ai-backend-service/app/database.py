import json
import logging
import os

from langdetect import detect
from langchain_community.embeddings import HuggingFaceEmbeddings
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Text, create_engine, DateTime, func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import declarative_base, sessionmaker

from app.schemas.faq import FAQCreate, Faq
from app.schemas.rules import RuleCreate, Rule

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base = declarative_base()

class RULE(Base):
    __tablename__ = 'rules'
    id = Column(Integer, primary_key=True)
    section = Column(String(100))
    text = Column(Text)
    language = Column(String(2))
    embedding = Column(Text)

class FAQ(Base):
    __tablename__ = 'faq'
    id = Column(Integer, primary_key=True)
    question = Column(Text)
    answer = Column(Text)
    language = Column(String(2))
    embedding = Column(Text)
    frequency_asked = Column(Integer, default=0)
    last_asked = Column(DateTime, default=func.now())

class DatabaseManager:
    def __init__(self, db_path: str = "sqlite:///./app/data/rules.db"):
        self.engine = create_engine(db_path)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.json_files_path = [
            os.path.join(base_dir, "data", "rules_en.json"),
            os.path.join(base_dir, "data", "rules_nl.json")
        ]
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        self.SessionLocal = sessionmaker(bind=self.engine)
        Base.metadata.create_all(self.engine, checkfirst=True)
        logger.info("Database Initialized")

    def get_db_session(self):
        session = self.SessionLocal()
        try:
            return session
        except:
            session.close()
            raise

    def is_database_empty(self) -> bool:
        session = self.get_db_session()
        try:
            return session.query(RULE).count() == 0
        except SQLAlchemyError as e:
            logger.error(f"Error checking if database is populated: {e}")
            raise
        finally:
            session.close()

    @staticmethod
    def detect_language(text: str) -> str:
        try:
            detected_language = detect(text)
            if detected_language == "en":
                return "en"
            elif detected_language == "nl":
                return "nl"
            else:
                return "un"
        except Exception as e:
            logger.warning(f"Error detecting language: {e}")
            return "un"

    @staticmethod
    def serialize_embedding(embedding):
        return json.dumps(embedding)

    @staticmethod
    def deserialize_embedding(embedding_text):
        return json.loads(embedding_text)

    def seed_database(self):
        if not self.is_database_empty():
            logger.info("Database already populated")
            return

        logger.info("Starting the seeding of the database...")
        try:
            for json_file in self.json_files_path:
                with open(json_file, "r", encoding="utf-8") as file:
                    data = json.load(file)

                    for rule in data.get("rules", []):
                        detected_rule = RuleCreate(
                            section=rule["section"],
                            text=rule["text"],
                            language=self.detect_language(rule["text"])
                        )
                        self.add_rule(detected_rule)

                logger.info(f"Seeding of {json_file} completed")
        except Exception as e:
            logger.error(f"Error seeding database: {e}")
            raise

    def add_rule(self, rule: RuleCreate):
        session = self.get_db_session()
        try:
            generated_embedding = self.embeddings.embed_query(rule.text)
            generated_embedding = self.serialize_embedding(generated_embedding)
            db_rule = RULE(
                **rule.model_dump(),
                embedding=generated_embedding
            )
            session.add(db_rule)
            session.commit()
            session.refresh(db_rule)
            logger.info(f"Rule {db_rule.id} added to database")
            return Rule.model_validate(db_rule)
        except SQLAlchemyError as e:
            session.rollback()
            logger.error(f"Error adding rule: {e}")
            raise
        finally:
            session.close()

    def add_faq(self, faq: FAQCreate):
        session = self.get_db_session()
        try:
            embedding = self.embeddings.embed_query(faq.question)
            embedding = self.serialize_embedding(embedding)
            db_faq = FAQ(
                **faq.model_dump(),
                embedding=embedding,
                frequency_asked=0
            )
            session.add(db_faq)
            session.commit()
            session.refresh(db_faq)
            logger.info(f"FAQ {db_faq.id} added to database")
        except SQLAlchemyError as e:
            session.rollback()
            logger.error(f"Error adding FAQ: {e}")
            raise
        finally:
            session.close()

    def remove_rule(self, rule_id: int) -> bool:
        session = self.get_db_session()
        try:
            rule = session.query(RULE).filter(RULE.id == rule_id).first()
            if rule:
                session.delete(rule)
                session.commit()
                logger.info(f"Rule {rule_id} got removed from the database")
                return True
            return False

        except SQLAlchemyError as e:
            session.rollback()
            logger.error(f"Error removing rule: {e}")
            raise
        finally:
            session.close()

    def update_faq_statistics(self, faq_id: int):
        session = self.get_db_session()
        try:
            faq = session.query(FAQ).filter(FAQ.id == faq_id).first()
            if faq:
                faq.frequency_asked += 1
                faq.last_asked = func.now()
                session.commit()
                logger.info(f"FAQ {faq_id} statistics updated")
        except SQLAlchemyError as e:
            session.rollback()
            logger.error(f"Error updating FAQ statistics: {e}")
            raise
        finally:
            session.close()

    def get_rule_by_text(self, text: Optional[str] = None) -> Rule | None:
        session = self.get_db_session()
        try:
            rule = session.query(RULE).filter(RULE.text == text).first()
            if rule:
                rule.embedding = self.deserialize_embedding(rule.embedding)
                return Rule.model_validate(rule)
            return None
        except SQLAlchemyError as e:
            logger.error(f"Error getting rule by text: {e}")
            raise
        finally:
            session.close()

    def get_rules(self, language: Optional[str] = None) -> List[Rule]:
        session = self.get_db_session()
        try:
            query = session.query(RULE)
            if language:
                query = query.filter(RULE.language == language)
            rules = query.all()
            for rule in rules:
                rule.embedding = self.deserialize_embedding(rule.embedding)
            return [Rule.model_validate(rule) for rule in rules]
        finally:
            session.close()

    def get_rules_with_embeddings(self, language: Optional[str] = None) -> List[RULE]:
        session = self.get_db_session()
        try:
            query = session.query(RULE)
            if language:
                query = query.filter(RULE.language == language)
            rules = query.all()
            for rule in rules:
                rule.embedding = self.deserialize_embedding(rule.embedding)
            return rules
        finally:
            session.close()

    def get_top_faq_questions(self, limit: int = 5) -> List[Faq]:
        session = self.get_db_session()
        try:
            faq_questions = session.query(FAQ).order_by(FAQ.frequency_asked.desc()).limit(limit).all()
            for faq in faq_questions:
                faq.embedding = self.deserialize_embedding(faq.embedding)
            return [faq.question for faq in faq_questions]
        except SQLAlchemyError as e:
            logger.error(f"Error getting top FAQ questions: {e}")
            raise
        finally:
            session.close()