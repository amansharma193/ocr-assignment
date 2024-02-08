from pymongo import MongoClient
from .config import Config


client = MongoClient(Config.MONGODB_URI)
db = client['Ocr']
collection = db['users']

class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def save(self):
        collection.insert_one({
            'username': self.username,
            'email': self.email,
            'password': self.password
        })
