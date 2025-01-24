from elasticsearch import Elasticsearch
from index import create_index
from transform.tr_game_per_day import create_tr_game_per_day

es = Elasticsearch(hosts=["http://localhost:9200"])

create_index("ruwe_data", es)

# create_tr_game_per_day(es, "ruwe_data","tr_game_per_day")



