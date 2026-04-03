from fastapi import FastAPI
from Routes import Device_Routes, Center_Routes

app = FastAPI(title="E-Scrape Mart API")

app.include_router(Device_Routes.router, prefix="/devices", tags=["Devices"])
app.include_router(Center_Routes.router, prefix="/centers", tags=["Centers"])

@app.get("/")
def root():
    return {"message": "E-Waste API Running 🚀"}