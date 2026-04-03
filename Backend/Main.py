from fastapi import FastAPI
from routes import device_routes, center_routes

app = FastAPI(title="E-Scrape Mart API")

app.include_router(device_routes.router, prefix="/devices", tags=["Devices"])
app.include_router(center_routes.router, prefix="/centers", tags=["Centers"])

@app.get("/")
def root():
    return {"message": "E-Waste API Running 🚀"}