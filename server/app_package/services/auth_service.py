# services/auth_service.py

from datetime import datetime, timedelta
import jwt
from flask import current_app as app

def generate_token(username):
    expiry = datetime.utcnow() + timedelta(hours=1)
    payload = {
        'username': username,
        'exp': expiry
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def authenticate_user(username, password):
    # Your authentication logic goes here
    pass

def register_user(username, email, password):
    # Your user registration logic goes here
    pass
