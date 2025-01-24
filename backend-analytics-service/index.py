def create_index(index_name, es):
    if es.indices.exists(index=index_name):
        es.indices.delete(index=index_name)
        print(f"Index '{index_name}' deleted.")
    else:
        print(f"Index '{index_name}' doesn't exist. Creating...")
    response = es.indices.create(index=index_name)
    print(f"Index '{index_name}' created: {response}")
