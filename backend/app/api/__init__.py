from flask import Flask
from .routes import articles  # Blueprint登録
from flask_cors import CORS  # ← 追加

def create_app():
    app = Flask(__name__)
    app.register_blueprint(articles.bp, url_prefix='/articles')
    CORS(app, origins=["http://localhost:3000"]) # CORS設定
    return app