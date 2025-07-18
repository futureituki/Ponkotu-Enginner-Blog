import os
from supabase import create_client, Client
from datetime import datetime
from typing import List, Dict, Optional, Any
from .storage import storage_service
import traceback

class ArticleService:
    def __init__(self):
        # Supabase接続情報を直接設定
        supabase_url = "https://imkisuezaqiwxnzyfhbn.supabase.co"
        supabase_key = "sb_secret_vp-VZQJtVU3s6Z3ZN46iNQ_iguS4mNS"
        
        print(supabase_url, supabase_key)
        print('--------------------------------')
        
        if not supabase_url or not supabase_key or supabase_url.strip() == "" or supabase_key.strip() == "":
            print("警告: SUPABASE_URLまたはSUPABASE_KEYが設定されていません。データベース機能は無効になります。")
            self.supabase = None
            return
            
        print('Supabaseクライアントを初期化中...')
        try:
            self.supabase: Client = create_client(supabase_url, supabase_key)
            print('Supabaseクライアントの初期化が完了しました')
        except Exception as e:
            print(f"Supabaseクライアントの初期化に失敗しました: {e}")
            self.supabase = None
    
    def get_articles(self) -> List[Dict[str, Any]]:
        print(self.supabase)
        if not self.supabase:
            print('Supabaseクライアントが無効のため、空のリストを返します')
            return []  # 空のリストを返す
        
        try:
            # カラム名をcreatedAtに統一
            response = self.supabase.table('articles').select('*').order('createdAt', desc=True).execute()
            return response.data
        except Exception as e:
            raise Exception(f"記事の取得に失敗しました: {str(e)}")

    def create_article(self, title: str, body: str, thumnail_path: str) -> Dict[str, Any]:
        """記事を作成"""
        if not self.supabase:
            raise Exception("Supabaseが設定されていません。環境変数SUPABASE_URLとSUPABASE_KEYを設定してください。")
        try:
            response = self.supabase.table('articles').insert({
                'title': title,
                'body': body,
                'thumnailPath': thumnail_path,
                'createdAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'updatedAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }).execute()
            return response.data[0]
        except Exception as e:
            raise Exception(f"記事の作成に失敗しました: {str(e)}")

    def get_article(self, uid: str) -> Optional[Dict[str, Any]]:
        """指定したIDの記事を取得"""
        if not self.supabase:
            return None
        try:
            response = self.supabase.table('articles').select('*').eq('uid', uid).single().execute()
            return response.data
        except Exception as e:
            print(f'記事取得中にエラーが発生しました: {e}')
            print(f'エラーの詳細: {traceback.format_exc()}')
            raise Exception(f"記事の取得に失敗しました: {str(e)}")

    def update_article(self, uid: str, title: str, body: str, thumnail_path: str) -> Optional[Dict[str, Any]]:
        """記事を更新"""
        if not self.supabase:
            raise Exception("Supabaseが設定されていません")
        try:
            # 古い記事データを取得
            old_article = self.get_article(uid)
            if not old_article:
                raise Exception("記事が見つかりません")

            # 記事を更新（カラム名を統一）
            response = self.supabase.table('articles').update({
                'title': title,
                'body': body,
                'thumnailPath': thumnail_path,
                'updatedAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }).eq('uid', uid).execute()

            # 古いサムネイル画像を削除（新しい画像が異なる場合）
            if old_article.get('thumnailPath') != thumnail_path:
                storage_service.delete_file(old_article.get('thumnailPath', ''))

            return response.data[0]
        except Exception as e:
            print(f'記事更新中にエラーが発生しました: {e}')
            print(f'エラーの詳細: {traceback.format_exc()}')
            raise Exception(f"記事の更新に失敗しました: {str(e)}")

    def delete_article(self, uid: str) -> bool:
        """記事を削除"""
        if not self.supabase:
            return False
        try:
            # 記事データを取得
            article = self.get_article(uid)
            if not article:
                raise Exception("記事が見つかりません")

            # サムネイル画像を削除
            if article.get('thumnailPath'):
                storage_service.delete_file(article['thumnailPath'])

            # 記事を削除
            response = self.supabase.table('articles').delete().eq('uid', uid).execute()
            return bool(response.data)
        except Exception as e:
            print(f'記事削除中にエラーが発生しました: {e}')
            print(f'エラーの詳細: {traceback.format_exc()}')
            raise Exception(f"記事の削除に失敗しました: {str(e)}")

article_service = ArticleService()