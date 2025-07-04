from flask import Flask, jsonify, Blueprint
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import check_password_hash, generate_password_hash

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