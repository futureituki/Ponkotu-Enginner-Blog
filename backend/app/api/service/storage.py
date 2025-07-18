import os
from supabase import create_client, Client
import magic
import uuid
from datetime import datetime

class StorageService:
    def __init__(self):
        supabase_url = "https://imkisuezaqiwxnzyfhbn.supabase.co"
        supabase_key = "sb_secret_vp-VZQJtVU3s6Z3ZN46iNQ_iguS4mNS"
        
        print(f"読み込まれた環境変数 - URL: {supabase_url}, Key: {supabase_key[:20] if supabase_key else 'None'}...")
        
        # 環境変数がない、空、またはプレースホルダーの場合は無効とする
        if (not supabase_url or not supabase_key or 
            supabase_url.strip() == "" or supabase_key.strip() == "" or
            "your_supabase" in supabase_url.lower() or "your_supabase" in supabase_key.lower()):
            print("警告: 有効なSUPABASE_URLとSUPABASE_KEYが設定されていません。ストレージ機能は無効になります。")
            print("実際のSupabaseのURLとキーを設定してください。")
            self.supabase = None
            return
            
        print('Supabaseクライアントを初期化中...')
        try:
            # URLの形式を簡単にチェック
            if not supabase_url.startswith('https://'):
                raise ValueError("Supabase URLはhttps://で始まる必要があります")
                
            self.supabase: Client = create_client(supabase_url, supabase_key)
            self.bucket_name = "article-thumnail"
            print('Supabaseクライアントの初期化が完了しました')
        except Exception as e:
            print(f"Supabaseクライアントの初期化に失敗しました: {e}")
            print("実際のSupabaseのURLとキーを設定してください。")
            print("403エラー（Unauthorized）の場合、APIキーが無効か期限切れです。")
            print("Supabaseダッシュボードで新しいanon publicキーを取得してください。")
            self.supabase = None

    def _ensure_bucket_exists(self):
        """バケットが存在することを確認し、なければ作成"""
        if not self.supabase:
            raise Exception("Supabaseクライアントが初期化されていません")
        try:
            self.supabase.storage.get_bucket(self.bucket_name)
        except:
            self.supabase.storage.create_bucket(self.bucket_name)

    def _get_mime_type(self, file_data: bytes) -> str:
        """ファイルのMIMEタイプを取得"""
        try:
            mime = magic.Magic(mime=True)
            return mime.from_buffer(file_data)
        except:
            # magic が使えない場合はデフォルトを返す
            return 'image/jpeg'

    def _generate_unique_filename(self, original_filename: str) -> str:
        """ユニークなファイル名を生成"""
        ext = original_filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        return f"{timestamp}_{unique_id}_{ext}"

    def upload_file(self, file_data: bytes, original_filename: str) -> str:
        """ファイルをアップロードしてURLを返す"""
        if not self.supabase:
            raise Exception("Supabaseが設定されていません。実際のSupabase URLとキーを環境変数に設定してください。")
            
        try:
            self._ensure_bucket_exists()
            
            # MIMEタイプをチェック
            mime_type = self._get_mime_type(file_data)
            print(f"検出されたMIMEタイプ: {mime_type}")
            
            if not mime_type.startswith('image/'):
                raise ValueError("画像ファイルのみアップロード可能です")

            # ユニークなファイル名を生成
            filename = self._generate_unique_filename(original_filename)
            print(f"生成されたファイル名: {filename}")
            
            print(f"ファイルをアップロード中: {filename} (MIME: {mime_type}, サイズ: {len(file_data)} bytes)")
            
            # ファイルをアップロード
            self.supabase.storage.from_(self.bucket_name).upload(
                path=filename,
                file=file_data,
                file_options={"content-type": mime_type}
            )
            
            # 公開URLを取得
            file_url = self.supabase.storage.from_(self.bucket_name).get_public_url(filename)
            return file_url

        except Exception as e:
            print(f"詳細なエラー情報: {e}")
            error_str = str(e)
            
            if "403" in error_str or "Unauthorized" in error_str:
                raise Exception(f"認証エラー: APIキーが無効か期限切れです。Supabaseダッシュボードで新しいanon publicキーを取得してください。詳細: {error_str}")
            elif "400" in error_str or "body/name must be string" in error_str:
                raise Exception(f"ファイル形式エラー: ファイルデータまたはファイル名の形式が正しくありません。詳細: {error_str}")
            elif "duplicate" in error_str.lower() or "already exists" in error_str.lower():
                # ファイル名の重複の場合は再試行
                filename = self._generate_unique_filename(original_filename)
                print(f"ファイル名が重複しました。新しいファイル名で再試行: {filename}")
                return self.upload_file(file_data, filename)
            else:
                raise Exception(f"ファイルアップロードに失敗しました: {error_str}")

    def delete_file(self, file_url: str) -> bool:
        """ファイルを削除"""
        if not self.supabase:
            return False
        try:
            # URLからファイル名を抽出
            filename = file_url.split('/')[-1]
            
            result = self.supabase.storage.from_(self.bucket_name).remove([filename])
            print(f"ファイル削除結果: {result}")
            return True
        except Exception as e:
            print(f"ファイル削除エラー: {e}")
            return False

storage_service = StorageService() 