from pydantic import BaseModel

class Center(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    verified: bool = True