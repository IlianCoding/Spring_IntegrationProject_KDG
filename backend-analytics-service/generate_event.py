players = [
    "Bryan", "Michelle", "Heather", "Jason", "Christopher", "John", "Matthew",
    "Ellen", "Tibo", "Wing", "Marc", "Mathias", "Ray", "Stephanie", "Renee",
    "Ilian", "Andrew", "William", "Debbie", "Lori", "Corey", "Anthony", "Carol",
    "Ronald", "Kathryn", "Hoying", "Dylan", "Adam", "Tracey", "Amy"
]

players1 = [
    "Bryan", "Jason", "Ellen", "Tibo", "Wing", "Mathias", "Ilian", "Hoying", "Dylan"
]

characters = [
    "murderer",
    "thief",
    "magician",
    "king",
    "preacher",
    "merchant",
    "buildingmaster",
    "condottiere"
]


def get_random_player():
    return random.choice(players)


def get_random_character():
    return random.choice(characters)


import os
import random
import json
import uuid
from datetime import datetime, timedelta


def create_event_directory(directory="event"):
    if not os.path.exists(directory):
        os.makedirs(directory)


def write_event_to_file(filename, event_data):
    try:
        with open(filename, 'w') as f:
            json.dump(event_data, f, indent=4)
    except Exception as e:
        print(f"Error writing to file {filename}: {e}")

def generate_date():
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 12, 31)
    delta = (end_date - start_date).days
    random_days = random.randint(0, delta)
    generated_date = start_date + timedelta(days=random_days)
    return generated_date

def generate_game_events(num_games):
    create_event_directory()

    for i in range(num_games):
        game_id = str(uuid.uuid4())
        shuffled_players = players1[:]
        random.shuffle(shuffled_players)
        game_players = shuffled_players[:4]
        rounds = random.randint(3, 7)
        duration = round(random.uniform(10.0, 60.0), 1)
        select_date = generate_date()

        for player in game_players:
            start_event = [{
                "event_type": "player_game_start",
                "game_id": game_id,
                "date": select_date.strftime("%Y-%m-%dT%H:%M:%S"),
                "player": player
            }]
            filename = f"event/player_game_start_{game_id}_{player}.json"
            write_event_to_file(filename, start_event)

        winner = random.choice(game_players)
        for round_num in range(rounds):
            for player in game_players:
                played_character_event = [{
                    "event_type": "played_character",
                    "game_id": game_id,
                    "date": (select_date + timedelta(seconds=round_num * 10)).strftime("%Y-%m-%dT%H:%M:%S"),
                    "player": player,
                    "character": get_random_character(),
                    "duration": duration,
                    "round": rounds,
                    "status": "win" if player == winner else "loss",
                }]
                filename = f"event/played_character_{game_id}_{player}_round{round_num + 1}.json"
                write_event_to_file(filename, played_character_event)

    return "Game events have been written to separate JSON files."


def generate_player_registration():
    data = []
    for player in players:
        player_data = {
            "event_type": "player_registration",
            "date": "2024-01-01T11:44:21",
            "player": player,
        }
        filename = f"event/player_registration_{player}_{datetime.now().strftime('%Y%m%d')}.json"
        with open(filename, 'w') as f:
            json.dump([player_data], f, indent=4)
    return data


def generate_player_login(num_player):
    data = []

    for i in range(num_player):
        select_date = generate_date()
        player_data = {
            "event_type": "player_login",
            "date": select_date.strftime("%Y-%m-%dT%H:%M:%S"),
            "player": get_random_player(),
        }
        filename = f"event/player_login_{select_date.strftime('%Y%m%d')}_{i + 1}.json"
        with open(filename, 'w') as f:
            json.dump([player_data], f, indent=4)
    return data
