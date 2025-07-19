import { useState, useEffect } from 'react'
import { Article } from '../models/Article'

export const useArticle = () => {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 記事取得処理（初期化時のリスト）
    const readArticle = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetch(`http://localhost:4000/articles`, {
                method: 'GET',
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                await readArticle();
            } catch (err) {
                console.error('初期データの取得に失敗:', err);
                setError('データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
        selectArticle,
        loading,
        error
    }
}