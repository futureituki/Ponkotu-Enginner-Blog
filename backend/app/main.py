from flask import Flask, jsonify
from api import create_app
from dotenv import load_dotenv
import os

# 環境変数の読み込み
load_dotenv()

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)
