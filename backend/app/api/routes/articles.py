from flask import Blueprint, jsonify, request
import pymysql
import os

bp = Blueprint("articles", __name__)

articles = [
    {
        "id": 1,
        "title": "Test Article 1",
        "body": "FlaskとMySQLを使ったAPIのサンプルです。",
        "author": "John Doe",
        "created_at": "2023-10-01T12:00:00Z",
        "updated_at": "2023-10-01T12:00:00Z"
    },
    {
        "id": 2,
        "title": "Flask + MySQL",
        "body": "FlaskとMySQLを使ったAPIのサンプルです。",
        "author": "John Doe",
        "created_at": "2023-10-01T12:00:00Z",
        "updated_at": "2023-10-01T12:00:00Z"
    },
    {
        "id": 3,
        "title": "Test Article 3",
        "body": "FlaskとMySQLを使ったAPIのサンプルです。",
        "author": "John Doe",
        "created_at": "2023-10-01T12:00:00Z",
        "updated_at": "2023-10-01T12:00:00Z"
    },
]
@bp.route("/", methods=["GET"])
def get(): 
    try:
        return jsonify(articles)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@bp.route("/<int:id>", methods=["GET"])
def get_by_id(id):
    try:
        if id == article["id"]:
            return jsonify(article)
        else:
            return jsonify({"error": "Article not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# def get_article(id):
#     try:
#         connection = pymysql.connect(
#             host=os.environ["DB_HOST"],
#             user=os.environ["DB_USER"],
#             password=os.environ["DB_PASS"],
#             database=os.environ["DB_NAME"],
#             port=3306
#         )
#         with connection.cursor() as cursor:
#             cursor.execute("SELECT NOW();")
#             result = cursor.fetchone()
#         connection.close()
#         return jsonify({"status": "ok", "time": result[0]})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)})