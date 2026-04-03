from pymongo import MongoClient

MONGO_URI = "mongodb+srv://<heritage_user>:<Team_Neural>@hackmatrix.hr0cabu.mongodb.net/?appName=HackMatrix"

client = MongoClient(MONGO_URI)
db = client["ewaste_db"]

device_collection = db["devices"]
center_collection = db["centers"]
