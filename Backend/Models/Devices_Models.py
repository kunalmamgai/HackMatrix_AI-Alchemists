from pydantic import BaseModel

class Device(BaseModel):
    name: str
    category: str
    disposal_instructions: str