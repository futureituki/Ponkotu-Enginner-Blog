import { useState, useEffect } from "react"
import { Article } from "@/app/type/article"

export const useArticle = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const readArticle = async (): Promise<Article[]> => {
        try {
            // force-cache: 記事一覧はキャッシュを優先（パフォーマンス重視）
            const res = await fetch(`http://localhost:4000/admin/read`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error('Failed to fetch articles');
            const data = await res.json();
            
            // APIレスポンスをArticleクラスインスタンスに変換
            const articleInstances = Article.fromApiResponseArray(data);
            setArticles(articleInstances);
            return articleInstances;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }

    // 強制的に最新データを取得する関数（管理画面用）
    const refreshArticles = async (): Promise<Article[]> => {
        try {
            setLoading(true);
            setError(null);
            // no-store: 常に最新データを取得（リアルタイム性重視）
            const res = await fetch(`http://localhost:4000/admin/read`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error('Failed to fetch articles');
            const data = await res.json();
            
            // APIレスポンスをArticleクラスインスタンスに変換
            const articleInstances = Article.fromApiResponseArray(data);
            setArticles(articleInstances);
            return articleInstances;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                await readArticle();
            } catch (err) {
                console.error('Failed to fetch articles:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const createArticle = async(articleData: Partial<Article>) => {
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
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            
            if (!res.ok) throw new Error('Failed to create article');
            await readArticle(); // 記事作成後に一覧を更新
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }

    const selectArticle = async(uid: string): Promise<Article> => {
        try {
            const res = await fetch(`http://localhost:4000/admin/article/${uid}`);
            if (!res.ok) throw new Error('Failed to select article');
            const data = await res.json();
            
            // APIレスポンスをArticleクラスインスタンスに変換
            return Article.fromApiResponse(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }

    return { articles, loading, error, readArticle, refreshArticles, createArticle, selectArticle }
}