def create_tr_game_duration(es, src_index, des_index):
    transform_job = {
        "id": des_index,
        "source": {
            "index": src_index,
            "query": {
                "match_all": {}
            }
        },
        "dest": {
            "index": des_index
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
                        "interval": 10
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
        }
    }

    try:
        es.transform.get_transform(transform_id=transform_job["id"])
        es.transform.delete_transform(transform_id=transform_job["id"], force=True)
        print(f"Deleted existing transform: {transform_job['id']}")
    except Exception as e:
        print(f"No existing transform to delete: {e}")

    response = es.transform.put_transform(
        transform_id=transform_job["id"],
        body=transform_job
    )

    es.transform.start_transform(transform_id=transform_job["id"])
    print("Transform job created and started:", response)
