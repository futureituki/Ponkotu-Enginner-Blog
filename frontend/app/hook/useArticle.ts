import { useState, useEffect } from 'react'
import { Article } from '../models/Article'

interface CreateArticleData {
  title: string;
  body: string;
  thumnailPath?: string;
}

export const useArticle = () => {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 記事取得処理（初期化時のリスト）
    const readArticle = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const res = await fetch(`http://localhost:4000/admin/read`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                cache: 'no-store' // 管理画面では常に最新データを取得
            });

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }

            const data = await res.json();
            
            // Article classのインスタンスに変換
            const articleInstances = Article.fromApiResponseArray(data);
            setArticles(articleInstances);
        } catch (err) {
            console.error('記事の取得に失敗:', err);
            setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    // 公開用記事リスト（初期表示用）
    const refreshArticles = async () => {
        try {
            const res = await fetch(`http://localhost:4000/admin/read`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'force-cache' // 公開画面では高速化のためキャッシュを使用
            });

            if (res.ok) {
                const data = await res.json();
                const articleInstances = Article.fromApiResponseArray(data);
                setArticles(articleInstances);
            }
        } catch (err) {
            console.error('記事の更新に失敗:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                await refreshArticles();
            } catch (err) {
                console.error('初期データの取得に失敗:', err);
                setError('データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const createArticle = async(articleData: CreateArticleData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Articleインスタンスを作成してバリデーション
            const article = new Article(articleData);
            const validation = article.validate();
            
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // FormDataに変換して送信
            const formData = article.toFormData();
            
            const res = await fetch(`http://localhost:4000/admin/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }

            const result = await res.json();
            console.log('記事作成成功:', result);
            
            // 記事リストを更新
            await readArticle();
            
            return result;
        } catch (err) {
            console.error('記事作成エラー:', err);
            throw err;
        }
    }

    const selectArticle = async (uid: string): Promise<Article> => {
        try {
            const res = await fetch(`http://localhost:4000//articles/${uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }

            const data = await res.json();
            return Article.fromApiResponse(data);
        } catch (err) {
            console.error('記事の詳細取得に失敗:', err);
            throw err;
        }
    };

    return {
        articles,
        readArticle,
        createArticle,
        selectArticle,
        refreshArticles,
        loading,
        error
    }
}