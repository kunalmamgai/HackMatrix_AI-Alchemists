from fastapi import APIRouter
from Models.Center_Models import Center
from Services.Center_Services import get_centers, add_center

router = APIRouter()


@router.get("/")
def fetch_centers():
    return get_centers()


@router.post("/")
def create_center(center: Center):
    return {"id": add_center(center)}
