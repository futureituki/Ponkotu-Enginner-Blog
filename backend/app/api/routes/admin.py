from flask import Flask, jsonify, Blueprint, request
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import check_password_hash, generate_password_hash
import pymysql
import os

bp = Blueprint("admin", __name__)
auth = HTTPBasicAuth()

users = {
    "admin": generate_password_hash("secret")
}

@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users.get(username), password):
        return username

# 認証が必要なルート
@bp.route('/', methods=["POST"])
@auth.login_required
def private_route():
    return jsonify({"message": f"Hello, {auth.current_user()}! This is a protected route."})

@bp.route('/create', methods=["POST"])
def create_articles():
    try:
        auth = request.form['auth']
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
             #オートコミットじゃないので、明示的にコミットを書く必要がある
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
            cursorclass=pymysql.cursors.DictCursor  # ← これがポイント
        )
        with connection.cursor() as cursor:
            sql = "SELECT * FROM articles"
            cursor.execute(sql)
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})