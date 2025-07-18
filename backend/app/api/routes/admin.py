from flask import Flask, jsonify, Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
from ..service.article import article_service

bp = Blueprint("admin", __name__)

# JWT設定
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'pass')
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'password'

users = {
    ADMIN_USERNAME: generate_password_hash(ADMIN_PASSWORD)
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
        print(ADMIN_USERNAME, ADMIN_PASSWORD)
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        print(username, password)
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
def create_article(current_user):
    try:
        title = request.form['title']
        body = request.form['body']
        thumnail_path = request.form['thumnailPath']

        # 入力値の検証
        if not title or not body:
            return jsonify({"error": "タイトルと本文は必須です"}), 400

        # 記事を作成
        article = article_service.create_article(title, body, thumnail_path)
        return jsonify(article)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/read', methods=["GET"])
def read_articles():
    try:
        articles = article_service.get_articles()
        return jsonify(articles)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/article/<uid>', methods=["GET"])
def get_article(uid):
    try:
        article = article_service.get_article(uid)
        if article:
            return jsonify(article)
        return jsonify({"error": "記事が見つかりません"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/article/<uid>', methods=["PUT"])
@token_required
def update_article(current_user, uid):
    try:
        title = request.form['title']
        body = request.form['body']
        thumnail_path = request.form['thumnailPath']

        # 入力値の検証
        if not title or not body:
            return jsonify({"error": "タイトルと本文は必須です"}), 400

        # 記事を更新
        article = article_service.update_article(uid, title, body, thumnail_path)
        if article:
            return jsonify(article)
        return jsonify({"error": "記事が見つかりません"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/article/<uid>', methods=["DELETE"])
@token_required
def delete_article(current_user, uid):
    try:
        if article_service.delete_article(uid):
            return jsonify({"message": "記事を削除しました"})
        return jsonify({"error": "記事が見つかりません"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500