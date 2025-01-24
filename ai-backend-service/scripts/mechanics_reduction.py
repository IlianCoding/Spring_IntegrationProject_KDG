import pandas as pd
import numpy as np

from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score
from sklearn.metrics.pairwise import cosine_similarity
from scipy.cluster.hierarchy import linkage, fcluster
from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler
from typing import Dict, Any, List, Optional, Callable

mechanic_categories = {
    # Action and Turn Management
    'Action Points': 'Action and Turn Management',
    'Simultaneous Action Selection': 'Action and Turn Management',
    'Action Queue': 'Action and Turn Management',
    'Turn Order: Progressive': 'Action and Turn Management',
    'Turn Order: Claim Action': 'Action and Turn Management',
    'Action Retrieval': 'Action and Turn Management',
    'Action Drafting': 'Action and Turn Management',
    'Action Timer': 'Action and Turn Management',
    'Turn Order: Role Order': 'Action and Turn Management',
    'Turn Order: Pass Order': 'Action and Turn Management',
    'Turn Order: Random': 'Action and Turn Management',
    'Turn Order: Auction': 'Action and Turn Management',
    'Turn Order: Stat-Based': 'Action and Turn Management',
    'Follow': 'Action and Turn Management',

    # Movement and Positioning
    'Grid Movement': 'Movement and Positioning',
    'Point to Point Movement': 'Movement and Positioning',
    'Area Movement': 'Movement and Positioning',
    'Hexagon Grid': 'Movement and Positioning',
    'Square Grid': 'Movement and Positioning',
    'Network and Route Building': 'Movement and Positioning',
    'Movement Points': 'Movement and Positioning',
    'Track Movement': 'Movement and Positioning',
    'Line of Sight': 'Movement and Positioning',
    'Movement Template': 'Movement and Positioning',
    'Relative Movement': 'Movement and Positioning',
    'Impulse Movement': 'Movement and Positioning',
    'Pattern Movement': 'Movement and Positioning',
    'Three Dimensional Movement': 'Movement and Positioning',
    'Crayon Rail System': 'Movement and Positioning',

    # Resource Management
    'Worker Placement': 'Resource Management',
    'Worker Placement with Dice Workers': 'Resource Management',
    'Trading': 'Resource Management',
    'Market': 'Resource Management',
    'Deck Bag and Pool Building': 'Resource Management',
    'Stock Holding': 'Resource Management',
    'Income': 'Resource Management',
    'Commodity Speculation': 'Resource Management',
    'Loans': 'Resource Management',
    'Investment': 'Resource Management',
    'Pick-up and Deliver': 'Resource Management',
    'Automatic Resource Growth': 'Resource Management',
    'Tech Trees / Tech Tracks': 'Resource Management',
    'Increase Value of Unchosen Resources': 'Resource Management',

    # Interaction and Conflict
    'Take That': 'Interaction and Conflict',
    'Auction/Bidding': 'Interaction and Conflict',
    'Betting and Bluffing': 'Interaction and Conflict',
    'Negotiation': 'Interaction and Conflict',
    'Team-Based Game': 'Interaction and Conflict',
    'Player Elimination': 'Interaction and Conflict',
    'Traitor Game': 'Interaction and Conflict',
    'Hidden Roles': 'Interaction and Conflict',
    'Voting': 'Interaction and Conflict',
    'Alliances': 'Interaction and Conflict',
    'Trick-taking': 'Interaction and Conflict',
    'Prisoner\'s Dilemma': 'Interaction and Conflict',
    'Communication Limits': 'Interaction and Conflict',
    'Bribery': 'Interaction and Conflict',
    'Kill Steal': 'Interaction and Conflict',
    'Sudden Death Ending': 'Interaction and Conflict',

    # Game Progression and Mechanics
    'Dice Rolling': 'Game Progression and Mechanics',
    'Card Drafting': 'Game Progression and Mechanics',
    'Push Your Luck': 'Game Progression and Mechanics',
    'Roll / Spin and Move': 'Game Progression and Mechanics',
    'Pattern Building': 'Game Progression and Mechanics',
    'Pattern Recognition': 'Game Progression and Mechanics',
    'Deck Construction': 'Game Progression and Mechanics',
    'Hand Management': 'Game Progression and Mechanics',
    'Set Collection': 'Game Progression and Mechanics',
    'Memory': 'Game Progression and Mechanics',
    'Chit-Pull System': 'Game Progression and Mechanics',
    'Events': 'Game Progression and Mechanics',
    'Critical Hits and Failures': 'Game Progression and Mechanics',
    'Stat Check Resolution': 'Game Progression and Mechanics',
    'Re-rolling and Locking': 'Game Progression and Mechanics',
    'Die Icon Resolution': 'Game Progression and Mechanics',
    'Random Production': 'Game Progression and Mechanics',

    # Strategic Elements
    'Variable Player Powers': 'Strategic Elements',
    'Area Majority / Influence': 'Strategic Elements',
    'Secret Unit Deployment': 'Strategic Elements',
    'Campaign / Battle Card Driven': 'Strategic Elements',
    'Contracts': 'Strategic Elements',
    'Variable Set-up': 'Strategic Elements',
    'Zone of Control': 'Strategic Elements',
    'End Game Bonuses': 'Strategic Elements',
    'Victory Points as a Resource': 'Strategic Elements',
    'Catch the Leader': 'Strategic Elements',
    'Ladder Climbing': 'Strategic Elements',
    'Connections': 'Strategic Elements',

    # Narrative and Thematic
    'Cooperative Game': 'Narrative and Thematic',
    'Storytelling': 'Narrative and Thematic',
    'Role Playing': 'Narrative and Thematic',
    'Scenario / Mission / Campaign Game': 'Narrative and Thematic',
    'Legacy Game': 'Narrative and Thematic',
    'Narrative Choice / Paragraph': 'Narrative and Thematic',
    'Acting': 'Narrative and Thematic',
    'Singing': 'Narrative and Thematic',
    'Paper-and-Pencil': 'Narrative and Thematic',

    # Auxiliary Mechanics
    'Modular Board': 'Auxiliary Mechanics',
    'Tile Placement': 'Auxiliary Mechanics',
    'Hidden Movement': 'Auxiliary Mechanics',
    'Deduction': 'Auxiliary Mechanics',
    'Simulation': 'Auxiliary Mechanics',
    'Solo / Solitaire Game': 'Auxiliary Mechanics',
    'Time Track': 'Auxiliary Mechanics',
    'Elapsed Real Time Ending': 'Auxiliary Mechanics',
    'Real-Time': 'Auxiliary Mechanics',
    'Rondel': 'Auxiliary Mechanics',
    'Programmed Movement': 'Auxiliary Mechanics',
    'Map Addition': 'Auxiliary Mechanics',
    'Map Reduction': 'Auxiliary Mechanics',
    'Map Deformation': 'Auxiliary Mechanics',

    # Additional Unique Mechanics
    'Card Play Conflict Resolution': 'Specialized Mechanics',
    'Line Drawing': 'Specialized Mechanics',
    'Rock-Paper-Scissors': 'Specialized Mechanics',
    'Race': 'Specialized Mechanics',
    'Auction: Sealed Bid': 'Specialized Mechanics',
    'Auction: Dutch': 'Specialized Mechanics',
    'Auction: Once Around': 'Specialized Mechanics',
    'Auction: English': 'Specialized Mechanics',
    'Stacking and Balancing': 'Specialized Mechanics',
    'Flicking': 'Specialized Mechanics',
    'I Cut You Choose': 'Specialized Mechanics',
    'Multiple-Lot Auction': 'Specialized Mechanics',
    'Closed Economy Auction': 'Specialized Mechanics',
    'Constrained Bidding': 'Specialized Mechanics',
    'Bingo': 'Specialized Mechanics',
    'Hot Potato': 'Specialized Mechanics',
    'Speed Matching': 'Specialized Mechanics',
    'Matching': 'Specialized Mechanics',
    'Pieces as Map': 'Specialized Mechanics',
    'King of the Hill': 'Specialized Mechanics'
}

def map_mechanics_to_categories(mechanics):
    if pd.isna(mechanics):
        return None
    mapped_mechanics = [mechanic_categories.get(m.strip(), 'Other') for m in mechanics.split(',')]
    return ', '.join(set(mapped_mechanics))

class MechanicClustering:
    def __init__(self,
                 items: List[str],
                 embedding_models: Optional[List[str]] = None,
                 clustering_algorithms: Optional[Dict[str, Any]] = None,
                 dimensionality_reduction_models: Optional[Dict[str, Callable]] = None):
        """
        This class uses a basic list of embedding models, clustering models, and dimensionality reduction models.
        It will automatically generate embeddings using these embedding models, clustering models, and dimensionality reduction models.
        The cluster will then be evaluated and named somewhat correctly to the given list of items and returned.

        :param items: List of unique items you want to cluster
        :param embedding_models: List of the chosen embedding models
        :param clustering_algorithms: List of the chosen clustering models
        :param dimensionality_reduction_models: List of the chosen dimensionality reduction models
        """
        self.items = items
        self.embedding_models = embedding_models or [
            'all-MiniLM-L6-v2',
            'all-mpnet-base-v2',
            'paraphrase-MiniLM-L6-v2',
            'multi-qa-MiniLM-L6-cos-v1'
        ]
        self.clustering_algorithms = clustering_algorithms or {
            'KMeans': KMeans(random_state=42),
            'AgglomerativeClustering': AgglomerativeClustering(),
            'DBSCAN': DBSCAN()
        }
        self.dimensionality_reduction_models = dimensionality_reduction_models or {
            'PCA': lambda n_components: PCA(n_components=n_components),
            'TruncatedSVD': lambda n_components: TruncatedSVD(n_components=n_components)
        }
        self._clustering_result = None

    def generate_embeddings(self, model_name: str) -> np.ndarray:
        """
        Generate embeddings using a specific model

        :param model_name: Name of the SentenceTransformer model
        :return: Numpy array of embeddings
        """
        embedder = SentenceTransformer(model_name)
        return embedder.encode(self.items)

    def evaluate_clustering(self, embeddings: np.ndarray, labels: np.ndarray) -> Dict[str, float]:
        """
        Evaluate clustering performance using multiple metrics

        :param embeddings: Input embeddings
        :param labels: Cluster labels
        :return: Dictionary of performance metrics
        """
        # Remove noise points for DBSCAN
        mask = labels != -1
        if np.sum(mask) > 1:
            try:
                return {
                    'silhouette_score': silhouette_score(embeddings[mask], labels[mask]),
                    'calinski_harabasz_score': calinski_harabasz_score(embeddings[mask], labels[mask]),
                    'davies_bouldin_score': davies_bouldin_score(embeddings[mask], labels[mask]),
                    'n_clusters': len(np.unique(labels[mask]))
                }
            except Exception as e:
                print(f"Evaluation error: {e}")
                return {}
        return {}

    def cluster_and_name_items(self,
                               n_components_range: List[int] = [5, 10, 20, 40, 80],
                               n_clusters_range: List[int] = [3, 5, 7, 10, 15, 20],
                               max_representatives: int = 30
                               ) -> Dict[str, Any]:
        """
        Comprehensive clustering analysis with dynamic cluster naming to maximize coverage.

        :param n_components_range: Range of dimensions for dimensionality reduction
        :param n_clusters_range: Range of clusters to test
        :param max_representatives: Maximum number of representatives to try per cluster
        :return: Dictionary containing the best configuration, best labels, and named clusters.
        """

        best_results = {
            'score': float('-inf'),
            'configuration': {},
            'labels': None,
            'embeddings': None,
            'embedding_model': None,
            'coverage_rate': 0
        }

        all_results = []
        cluster_names = {}

        for model_name in self.embedding_models:
            # Generate embeddings
            embeddings = self.generate_embeddings(model_name)

            # Standardize embeddings
            scaler = StandardScaler()
            scaled_embeddings = scaler.fit_transform(embeddings)

            # Dimensionality Reduction
            for reduction_name, reduction_method in self.dimensionality_reduction_models.items():
                for n_components in n_components_range:
                    reducer = reduction_method(n_components)
                    reduced_items = reducer.fit_transform(scaled_embeddings)

                    # Clustering
                    for cluster_name, clustering_algorithm in self.clustering_algorithms.items():
                        if cluster_name == 'KMeans':
                            for n_clusters in n_clusters_range:
                                clustering_algorithm_with_clusters = KMeans(
                                    n_clusters=n_clusters,
                                    random_state=42
                                )
                                labels = clustering_algorithm_with_clusters.fit_predict(reduced_items)

                                # Try different numbers of representatives to maximize coverage
                                for n_representatives in range(1, max_representatives + 1):
                                    # Name clusters
                                    named_clusters = self.name_clusters(
                                        reduced_items,
                                        labels,
                                        n_representatives=n_representatives
                                    )

                                    # Calculate coverage rate
                                    mechanics_covered = set()
                                    for cluster_reps in named_clusters.values():
                                        mechanics_covered.update(cluster_reps)

                                    coverage_rate = len(mechanics_covered) / len(self.items)

                                    # Evaluate clustering
                                    scores = self.evaluate_clustering(reduced_items, labels)

                                    if scores:
                                        combined_score = (
                                                scores['silhouette_score'] +
                                                scores['calinski_harabasz_score'] / 1000 -
                                                scores['davies_bouldin_score']
                                        )

                                        result = {
                                            'embedding_model': model_name,
                                            'reduction_method': reduction_name,
                                            'n_components': n_components,
                                            'clustering_method': cluster_name,
                                            'n_clusters': n_clusters,
                                            'n_representatives': n_representatives,
                                            'scores': scores,
                                            'combined_score': combined_score,
                                            'coverage_rate': coverage_rate
                                        }

                                        all_results.append(result)

                                        # Update best results prioritizing coverage and score
                                        score_weight = 0.7
                                        coverage_weight = 0.3
                                        total_score = (
                                                score_weight * combined_score +
                                                coverage_weight * coverage_rate
                                        )

                                        if total_score > best_results['score']:
                                            best_results = {
                                                'score': total_score,
                                                'configuration': result,
                                                'labels': labels,
                                                'embeddings': reduced_items,
                                                'embedding_model': model_name,
                                                'coverage_rate': coverage_rate,
                                                'n_representatives': n_representatives
                                            }

                        # Similar logic for other clustering algorithms (AgglomerativeClustering, DBSCAN)
                        else:
                            try:
                                labels = clustering_algorithm.fit_predict(reduced_items)

                                # Try different numbers of representatives to maximize coverage
                                for n_representatives in range(1, max_representatives + 1):
                                    # Name clusters
                                    named_clusters = self.name_clusters(
                                        reduced_items,
                                        labels,
                                        n_representatives=n_representatives
                                    )

                                    # Calculate coverage rate
                                    mechanics_covered = set()
                                    for cluster_reps in named_clusters.values():
                                        mechanics_covered.update(cluster_reps)

                                    coverage_rate = len(mechanics_covered) / len(self.items)

                                    # Evaluate clustering
                                    scores = self.evaluate_clustering(reduced_items, labels)

                                    if scores:
                                        combined_score = (
                                                scores['silhouette_score'] +
                                                scores['calinski_harabasz_score'] / 1000 -
                                                scores['davies_bouldin_score']
                                        )

                                        result = {
                                            'embedding_model': model_name,
                                            'reduction_method': reduction_name,
                                            'n_components': n_components,
                                            'clustering_method': cluster_name,
                                            'scores': scores,
                                            'combined_score': combined_score,
                                            'coverage_rate': coverage_rate
                                        }

                                        all_results.append(result)

                                        # Update best results prioritizing coverage and score
                                        score_weight = 0.7
                                        coverage_weight = 0.3
                                        total_score = (
                                                score_weight * combined_score +
                                                coverage_weight * coverage_rate
                                        )

                                        if total_score > best_results['score']:
                                            best_results = {
                                                'score': total_score,
                                                'configuration': result,
                                                'labels': labels,
                                                'embeddings': reduced_items,
                                                'embedding_model': model_name,
                                                'coverage_rate': coverage_rate,
                                                'n_representatives': n_representatives
                                            }

                            except Exception as error:
                                print(f"Caught a clustering error: {error}")

        # Naming the clusters from the best configuration
        if best_results['labels'] is not None:
            cluster_names = self.name_clusters(
                best_results['embeddings'],
                best_results['labels'],
                n_representatives=best_results['n_representatives']
            )

        self._clustering_result = {
            'best_configuration': best_results['configuration'],
            'best_labels': best_results['labels'],
            'all_results': all_results,
            'cluster_names': cluster_names,
            'items': self.items,
            'coverage_rate': best_results['coverage_rate']
        }

        return self._clustering_result

    def name_clusters(self, embeddings: np.ndarray, labels: np.ndarray, n_representatives: int = 3) -> Dict[int, List[str]]:
        """
        Generate cluster names based on most representative mechanics

        :param embeddings: Reduced embeddings
        :param labels: Cluster labels
        :param n_representatives: Number of representative mechanics per cluster
        :return: Dictionary of cluster names
        """
        cluster_names = {}
        for cluster in np.unique(labels):
            if cluster == -1:  # Skip noise points in DBSCAN
                continue

            cluster_mask = (labels == cluster)
            cluster_embeddings = embeddings[cluster_mask]
            cluster_mechanics = [self.items[i] for i in range(len(self.items)) if cluster_mask[i]]

            # Find cluster centroid
            centroid = cluster_embeddings.mean(axis=0)

            # Find mechanics closest to centroid
            distances = np.linalg.norm(cluster_embeddings - centroid, axis=1)
            representative_indices = distances.argsort()[:n_representatives]

            cluster_names[cluster] = [cluster_mechanics[i] for i in representative_indices]

        return cluster_names

    def map_to_clusters(self, df: pd.DataFrame, column: str) -> pd.DataFrame:
        """
        Map a DataFrame column to the discovered clusters, handling comma-separated mechanics

        :param df: Input DataFrame
        :param column: Column to map to clusters
        :return: DataFrame with an additional cluster column
        """
        if self._clustering_result is None:
            self.cluster_and_name_items()

        # Create a mapping dictionary
        mechanics_to_clusters = {}
        for cluster, representatives in self._clustering_result['cluster_names'].items():
            for rep in representatives:
                mechanics_to_clusters[rep] = cluster

        # Function to map mechanics to clusters
        def map_mechanics_to_cluster(mechanics_str):
            if pd.isna(mechanics_str):
                return np.nan

            mechanics_list = [m.strip() for m in mechanics_str.split(',')]
            clusters = []

            for mechanic in mechanics_list:
                if mechanic in mechanics_to_clusters:
                    cluster = str(mechanics_to_clusters[mechanic])
                    if cluster not in clusters:
                        clusters.append(cluster)

            return ', '.join(clusters) if clusters else np.nan

        df['mechanic_cluster'] = df[column].apply(map_mechanics_to_cluster)
        return df

    def get_cluster_details(self) -> Dict[str, Any]:
        """
        Retrieve the clustering results

        :return: Dictionary containing clustering details
        """
        if self._clustering_result is None:
            raise ValueError("Run cluster_and_name_mechanics() first.")

        return self._clustering_result

def generate_embeddings(mechanics):
    """
    Generate embeddings for all the mechanics in the given list.
    The embedder used here is SentenceTransformer.
    :param mechanics: The list of mechanics to generate embeddings for.
    :return: The embeddings for the given mechanics.
    """
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = embedder.encode(mechanics)
    return embeddings

def calculate_similarity_matrix(embeddings, labels):
    """
    Calculate the similarity matrix for the given embeddings of the mechanics column.
    :param embeddings: The embeddings of the mechanics column.
    :param labels: The labels of the mechanics.
    :return: The similarity matrix for the given embeddings.
    """

    similarity_matrix = cosine_similarity(embeddings)
    similarity_df = pd.DataFrame(similarity_matrix, columns=labels, index=labels)
    return similarity_df

def clustering_mechanics(embeddings, threshold=1):
    """
    Cluster the mechanics based on the given embeddings.
    :param embeddings: The embeddings of the mechanics column.
    :param threshold: The threshold to consider for clustering.
    :return: The clusters of the mechanics based on the given embeddings.
    """
    cluster_matrix = linkage(embeddings, method='ward')
    clusters = fcluster(cluster_matrix, t=threshold, criterion='distance')

    return clusters

def mapping_mechanics_to_clusters(df, column, mechanics, clusters):
    """
    Map the mechanics to the clusters.
    :param df: The dataframe containing the mechanics column.
    :param column: The column containing the mechanics.
    :param mechanics: The list of mechanics.
    :param clusters: The clusters of the mechanics.
    :return: The dataframe with the mechanics mapped to the clusters.
    """
    cluster_mapping = dict(zip(mechanics, clusters))

    def map_to_cluster(map_mechanics):
        if pd.isna(map_mechanics):
            return None
        mapped_clusters = {cluster_mapping.get(m.strip(), 'Other') for m in map_mechanics.split(',')}
        return ', '.join(f"Cluster {c}" for c in mapped_clusters)

    df['Mapped Clusters'] = df[column].apply(map_to_cluster)
    return df

def encode_mechanics_binary_matrix(df, column):
    """
    This encodes the mechanics column into a binary matrix.
    The encoding is done using the MultiLabelBinarizer.
    :param df: The dataframe containing the mechanics column.
    :param column: The column containing the mechanics.
    :return: The encoded mechanics and the MultiLabelBinarizer object.
    """

    mechanics_list = df[column].dropna().apply(lambda x: [m.strip() for m in x.split(',')])
    mlb = MultiLabelBinarizer()
    encoded_mechanics = mlb.fit_transform(mechanics_list)

    return encoded_mechanics, mlb