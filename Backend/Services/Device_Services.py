from config.db import get_device_collection
from schemas.device_schema import device_serializer


def get_all_devices():
    devices = get_device_collection().find()
    return [device_serializer(d) for d in devices]


def add_device(device):
    result = get_device_collection().insert_one(device.dict())
    return str(result.inserted_id)
