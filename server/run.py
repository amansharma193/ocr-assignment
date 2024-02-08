from flask import Flask
from flask_cors import CORS
from app_package.routes.auth import auth_bp

app = Flask(__name__)
app.register_blueprint(auth_bp)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World! This is my Flask app.'

if __name__ == '__main__':
    app.run(debug=True)
