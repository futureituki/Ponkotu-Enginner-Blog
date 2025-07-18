from flask import Blueprint, jsonify, request
import os
from ..service.article import article_service

bp = Blueprint("articles", __name__)

@bp.route("/", methods=["GET"])
def get(): 
    try:
        articles = article_service.get_articles()
        return jsonify(articles)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/<uid>", methods=["GET"])
def get_by_id(uid):
    try:
        article = article_service.get_article(uid)
        if article:
            return jsonify(article)
        return jsonify({"error": "記事が見つかりません"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500