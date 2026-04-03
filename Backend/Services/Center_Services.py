from config.db import center_collection
from schemas.center_schema import center_serializer


def get_centers():
    centers = center_collection.find()
    return [center_serializer(c) for c in centers]


def add_center(center):
    result = center_collection.insert_one(center.dict())
    return str(result.inserted_id)
