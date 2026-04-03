from fastapi import APIRouter
from Models.Devices_Models import Device
from Services.Device_Services import get_all_devices, add_device

router = APIRouter()

@router.get("/")
def fetch_devices():
    return get_all_devices()

@router.post("/")
def create_device(device: Device):
    return {"id": add_device(device)}