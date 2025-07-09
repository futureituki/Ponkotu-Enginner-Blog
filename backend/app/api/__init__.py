from flask import Flask
from .routes import articles, admin, upload_file  # Blueprint登録
from flask_cors import CORS  # ← 追加


def create_app():
    app = Flask(__name__)
    app.register_blueprint(articles.bp, url_prefix='/articles')
    app.register_blueprint(upload_file.bp)
    app.register_blueprint(admin.bp, url_prefix='/admin')
    CORS(app, origins=["http://localhost:3000"]) # CORS設定
    return app