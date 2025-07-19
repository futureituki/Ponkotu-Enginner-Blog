// 管理画面のAPIを呼び出すためのフック

import { useState, useEffect } from 'react';
import { Article } from '@/app/models/Article';

interface CreateArticleData {
    title: string;
    body: string;
    thumnailPath?: string;
  }

export const useAdmin = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const readArticle = async () => {
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
                cache: 'no-store'
            });

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }

            const data = await res.json();
            const articleInstances = Article.fromApiResponseArray(data);
            setArticles(articleInstances);
        } catch (err) {
            console.error('記事の取得に失敗:', err);
            setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
        }
    }

    const login = async (username: string, password: string) => {
        try {
            const res = await fetch(`http://localhost:4000/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                throw new Error('ログインに失敗しました');
            }

            const data = await res.json();
            if (res.ok) {
                setIsAuthenticated(true);
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'ログインエラーが発生しました');
            setIsAuthenticated(false);
        }
    }

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

    useEffect(() => {
        readArticle();
    }, []);

    return {
        isAuthenticated,
        error,
        login,
        createArticle,
        articles,
        readArticle
    }
}