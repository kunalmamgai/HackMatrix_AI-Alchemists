from fastapi import APIRouter
from models.center_model import Center
from services.center_service import get_centers, add_center

router = APIRouter()

@router.get("/")
def fetch_centers():
    return get_centers()

@router.post("/")
def create_center(center: Center):
    return {"id": add_center(center)}