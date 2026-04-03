def center_serializer(center) -> dict:
    return {
        "id": str(center["_id"]),
        "name": center["name"],
        "address": center["address"],
        "latitude": center["latitude"],
        "longitude": center["longitude"],
        "verified": center["verified"]
    }