import os
import sys

# Ensure the Backend/ package is importable no matter how this file is loaded:
# `uvicorn Backend.Main:app` from the repo root, `uvicorn Main:app` from inside
# Backend/, or Vercel's Python runtime, which loads the file by path.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from Routes import device_routes, Center_Routes

app = FastAPI(title="ReCircuit API")

app.include_router(device_routes.router, prefix="/devices", tags=["Devices"])
app.include_router(Center_Routes.router, prefix="/centers", tags=["Centers"])


@app.get("/")
def root():
    return {"message": "ReCircuit API Running 🚀"}
