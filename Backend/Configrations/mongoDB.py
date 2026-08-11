import os
from functools import lru_cache

from pymongo import MongoClient

# Read the connection string from the environment (set MONGO_URI in Vercel).
# The fallback keeps local development working without extra setup.
MONGO_URI = os.environ.get(
    "MONGO_URI",
    "mongodb+srv://<heritage_user>:<Team_Neural>@hackmatrix.hr0cabu.mongodb.net/?appName=HackMatrix",
)


# Lazy, cached connections so importing this module never touches the network.
# PyMongo resolves `mongodb+srv` DNS records eagerly in MongoClient(), so
# connecting at import time would break serverless cold starts whenever the
# URI is missing or the DNS lookup fails.
@lru_cache(maxsize=1)
def get_client():
    return MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)


@lru_cache(maxsize=1)
def get_db():
    return get_client()["ewaste_db"]


def get_device_collection():
    return get_db()["devices"]


def get_center_collection():
    return get_db()["centers"]
