from flask import Flask, jsonify, Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash
import pymysql
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps

bp = Blueprint("admin", __name__)

# JWT設定
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'password')

users = {
    "admin": generate_password_hash("secret")
}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Bearer tokenの場合
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@bp.route('/login', methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required!'}), 400
        
        if username in users and check_password_hash(users.get(username), password):
            # JWTトークンを生成
            token = jwt.encode({
                'username': username,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, SECRET_KEY, algorithm='HS256')
            
            return jsonify({
                'message': 'Login successful!',
                'token': token,
                'username': username
            })
        else:
            return jsonify({'message': 'Invalid credentials!'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/verify', methods=["POST"])
@token_required
def verify_token(current_user):
    return jsonify({
        'message': f'Hello, {current_user}! Token is valid.',
        'username': current_user
    })

@bp.route('/create', methods=["POST"])
@token_required
def create_articles(current_user):
    try:
        title = request.form['title']
        body = request.form['body']
        thumnailPath = request.form['thumnailPath']
        
        connection = pymysql.connect(
            host=os.environ["DB_HOST"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASS"],
            database=os.environ["DB_NAME"],
            port=3306
        )
        with connection.cursor() as cursor:
             sql = "INSERT INTO articles (title, body, thumnailPath) VALUES (%s, %s, %s)"
             cursor.execute(sql, (title, body, thumnailPath))
             connection.commit()
        return jsonify({"status": "ok"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@bp.route('/read', methods=["GET"])
def read_articles():
    try:
        connection = pymysql.connect(
            host=os.environ["DB_HOST"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASS"],
            database=os.environ["DB_NAME"],
            port=3306,
            cursorclass=pymysql.cursors.DictCursor
        )
        with connection.cursor() as cursor:
            sql = "SELECT * FROM articles"
            cursor.execute(sql)
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})