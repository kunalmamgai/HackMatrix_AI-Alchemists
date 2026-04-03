def device_serializer(device) -> dict:
    return {
        "id": str(device["_id"]),
        "name": device["name"],
        "category": device["category"],
        "disposal_instructions": device["disposal_instructions"]
    }