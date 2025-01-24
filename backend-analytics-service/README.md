# Setup
Om de analytisch gedeelte in de backend te kunnen runnen, moet volgende stappen eerst worden uitgevoerd:
```commandline
cd elk_kafka
docker-compose up -d
```
# Deliverables:
## Metrieken:
### Standaard gaming metrics voor het management
- Als productmanager wil ik inzicht krijgen in het aantal games dat spelers dagelijks spelen.
- Als productmanager wil ik een overzicht krijgen van het aantal games binnen specifieke tijdsintervallen (bijvoorbeeld 10-20 minuten).
- Als productmanager wil ik inzicht krijgen in het maandelijkse percentage ingelogde spelers ten opzichte van het totale aantal geregistreerde gebruikers.
### Game specific metrics
- Als speler wil ik een overzicht van de winrates van alle spelers.
- Als speler wil ik een overzicht van de winper centages, gegroepeerd op het aantal rondes.
- Als speler wil ik inzicht krijgen in hoe vaak ik een bepaald character heb gespeeld en wat de winrate daarvan is.

## Configuraties:
### Logstash
![logstash.png](deliverable%2Flogstash.png)
### Dashboard exports
[export.ndjson](deliverable%2Fexport.ndjson)

## Screenshots:
### Wireframes
![wf_duration.png](deliverable%2Fwf_duration.png)
![wf_games_per_day.png](deliverable%2Fwf_games_per_day.png)
![wf_login.png](deliverable%2Fwf_login.png)
![wf_winrate_characters.png](deliverable%2Fwf_winrate_characters.png)
![wf_winrate_player.png](deliverable%2Fwf_winrate_player.png)
![wf_winrate_round.png](deliverable%2Fwf_winrate_round.png)

### Dashboard
![db_duration.png](deliverable%2Fdb_duration.png)
![db_games_per_month.png](deliverable%2Fdb_games_per_month.png)
![db_login_percentage.png](deliverable%2Fdb_login_percentage.png)
![db_winrate_character.png](deliverable%2Fdb_winrate_character.png)
![db_winrate_player.png](deliverable%2Fdb_winrate_player.png)
![db_winrate_round.png](deliverable%2Fdb_winrate_round.png)
Link to dashboard: 
http://localhost:5601/app/dashboards#/view/5088699d-5acc-4a51-9b4d-112df67d72d9?_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-1y%2Fd,to:now))&_a=()

### Transform
<details>
  <summary>View mock_game_duration</summary>
```
{
  "id": "mock_game_duration",
  "version": "10.0.0",
  "create_time": 1735911417517,
  "source": {
    "index": [
      "ruwe_testdata"
    ],
    "query": {
      "match_all": {}
    }
  },
  "dest": {
    "index": "mock_game_duration"
  },
  "sync": {
    "time": {
      "field": "date",
      "delay": "60s"
    }
  },
  "pivot": {
    "group_by": {
      "duration": {
        "histogram": {
          "field": "duration",
          "interval": "10"
        }
      }
    },
    "aggregations": {
      "game_id.cardinality": {
        "cardinality": {
          "field": "game_id.keyword"
        }
      }
    }
  },
  "settings": {}
}
```
</details>

<details>
  <summary>View mock_game_per_day</summary>
```
{
  "id": "mock_game_per_day",
  "version": "10.0.0",
  "create_time": 1735811441366,
  "source": {
    "index": [
      "ruwe_testdata"
    ],
    "query": {
      "bool": {
        "filter": [
          {
            "bool": {
              "should": [
                {
                  "match": {
                    "event_type": "player_game_start"
                  }
                }
              ],
              "minimum_should_match": 1
            }
          }
        ]
      }
    }
  },
  "dest": {
    "index": "mock_game_per_day"
  },
  "sync": {
    "time": {
      "field": "date",
      "delay": "60s"
    }
  },
  "pivot": {
    "group_by": {
      "date": {
        "date_histogram": {
          "field": "date",
          "calendar_interval": "1m"
        }
      }
    },
    "aggregations": {
      "game_id.cardinality": {
        "cardinality": {
          "field": "game_id.keyword"
        }
      }
    }
  },
  "settings": {}
}
```
</details>

<details>
  <summary>View mock_login</summary>
```
{
  "id": "mock_login",
  "version": "10.0.0",
  "create_time": 1735933167322,
  "source": {
    "index": [
      "ruwe_testdata"
    ],
    "query": {
      "match_all": {}
    }
  },
  "dest": {
    "index": "mock_login"
  },
  "sync": {
    "time": {
      "field": "date",
      "delay": "60s"
    }
  },
  "pivot": {
    "group_by": {
      "date": {
        "date_histogram": {
          "field": "date",
          "calendar_interval": "1m"
        }
      }
    },
    "aggregations": {
      "player_registration": {
        "filter": {
          "term": {
            "event_type.keyword": "player_registration"
          }
        }
      },
      "player_login": {
        "filter": {
          "term": {
            "event_type.keyword": "player_login"
          }
        },
        "aggs": {
          "player.cardinality": {
            "cardinality": {
              "field": "player.keyword"
            }
          }
        }
      }
    }
  },
  "settings": {}
}
```
</details>

<details>
  <summary>View mock_player_winrate</summary>
```
{
  "id": "mock_player_winrate",
  "version": "10.0.0",
  "create_time": 1735910777784,
  "source": {
    "index": [
      "ruwe_testdata"
    ],
    "query": {
      "match_all": {}
    }
  },
  "dest": {
    "index": "mock_player_winrate"
  },
  "sync": {
    "time": {
      "field": "date",
      "delay": "60s"
    }
  },
  "pivot": {
    "group_by": {
      "player": {
        "terms": {
          "field": "player.keyword"
        }
      }
    },
    "aggregations": {
      "win": {
        "filter": {
          "term": {
            "status.keyword": "win"
          }
        },
        "aggs": {
          "game_id.cardinality": {
            "cardinality": {
              "field": "game_id.keyword"
            }
          }
        }
      },
      "game_id.cardinality": {
        "cardinality": {
          "field": "game_id.keyword"
        }
      }
    }
  },
  "settings": {}
}
```
</details>

