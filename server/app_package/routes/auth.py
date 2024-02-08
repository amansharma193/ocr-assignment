from flask import jsonify, request, Blueprint, current_app
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from ..models import User
import jwt
from datetime import datetime, timedelta
from ..models import db
from ..config import Config
from ..utils import extract_text

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']

        print(" middleware is running ", token)
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        except Exception as e:
            print("data ", e)
            return jsonify({'message': 'Token is invalid'}), 401

        return f(*args, **kwargs)

    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400

    user = db.users.find_one({'username': data['username']})
    if user and check_password_hash(user['password'], data['password']):
        token = jwt.encode({
            'username': user['username'],
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, Config.SECRET_KEY, algorithm='HS256')
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid username or password'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400

    hashed_password = generate_password_hash(data['password'])
    user = User(username=data['username'], email=data['email'], password=hashed_password)
    user.save()
    
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/process_image', methods=['POST'])
def process_image():
    image_file = request.files.get('image')
    if not image_file:
        return jsonify({'error': 'No image provided'}), 400

    processed_data = extract_text(image_file)
    
    result = db.Documents.insert_one(processed_data)
    if result.acknowledged:
        return jsonify({'image_url': processed_data['image_url'], 'parsed_text': processed_data['parsed_text']}), 200
    else:
        return jsonify({'error': 'Failed to save data'}), 500


@auth_bp.route('/get_documents', methods=['GET'])
@token_required
def get_documents():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))

    documents = db.Documents.find({}, {'_id': 0}).sort({'_id': -1}).skip((page - 1) * per_page).limit(per_page)
    documents_list = list(documents)

    return jsonify({'documents': documents_list})
