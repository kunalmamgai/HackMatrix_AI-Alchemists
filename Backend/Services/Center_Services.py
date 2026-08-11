from config.db import get_center_collection
from schemas.center_schema import center_serializer


def get_centers():
    centers = get_center_collection().find()
    return [center_serializer(c) for c in centers]


def add_center(center):
    result = get_center_collection().insert_one(center.dict())
    return str(result.inserted_id)
