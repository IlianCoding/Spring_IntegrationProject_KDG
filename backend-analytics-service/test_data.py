import json
import os
from uuid import uuid4

from elasticsearch import Elasticsearch

from generate_event import generate_player_registration, generate_player_login, generate_game_events
from index import create_index

es = Elasticsearch(hosts=["http://localhost:9200"])

# if not os.path.exists('event'):
#     os.mkdir('event')
#
# # Generate test data
# generate_game_events(20)
#
# # Analyse % loggedIn player per day
# generate_player_registration()
generate_player_login(120)
#
# # Create index for testdata
# create_index("ruwe_testdata", es)

INDEX_NAME = "ruwe_testdata"

DATA_DIR = "event"

if es.indices.exists(index=INDEX_NAME):
    es.indices.delete(index=INDEX_NAME)

es.indices.create(index=INDEX_NAME)

for filename in os.listdir(DATA_DIR):
    if filename.endswith(".json"):
        filepath = os.path.join(DATA_DIR, filename)
        with open(filepath, 'r') as file:
            data = json.load(file)
            for event in data:
                event_id= str(uuid4())
                res = es.index(index=INDEX_NAME, id=event_id, body=event)
                if res['result'] == 'created':
                    print(f"Event {event_id} from {filename} indexed successfully.")
                else:
                    print(f"Failed to index event {event_id} from {filename}.")

print("Alle data is geüpload!")

