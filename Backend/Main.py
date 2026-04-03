from fastapi import FastAPI
<<<<<<< HEAD
from routes import device_routes, center_routes
=======
from Routes import Device_Routes, Center_Routes
>>>>>>> 063a5b8e2a3c2b451ed52efdebb025942cfd6883

app = FastAPI(title="E-Scrape Mart API")

app.include_router(Device_Routes.router, prefix="/devices", tags=["Devices"])
app.include_router(Center_Routes.router, prefix="/centers", tags=["Centers"])

@app.get("/")
def root():
    return {"message": "E-Waste API Running 🚀"}