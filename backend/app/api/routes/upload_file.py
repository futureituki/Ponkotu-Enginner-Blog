from ..service.storage import storage_service
from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

bp = Blueprint('upload_file', __name__)

@bp.route('/upload_file', methods=["POST"])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        try:
            # ファイルデータを読み込み
            file_data = file.read()
            # Supabaseにアップロード
            file_url = storage_service.upload_file(file_data, secure_filename(file.filename))
            return jsonify({"url": file_url})
        except Exception as e:
            return jsonify({"error": str(e)}), 400