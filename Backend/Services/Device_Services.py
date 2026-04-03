from config.db import device_collection
from schemas.device_schema import device_serializer


def get_all_devices():
    devices = device_collection.find()
    return [device_serializer(d) for d in devices]


def add_device(device):
    result = device_collection.insert_one(device.dict())
    return str(result.inserted_id)
