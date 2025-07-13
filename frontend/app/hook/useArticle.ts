'use client';
import { useEffect, useState } from "react"
import { Article } from "@/app/type/article"

export const useArticle = () => {
    const [articles, setArticles] = useState<Article[]>([])
    const [error, setError] = useState<null | string>(null)

    const readArticle = async () => {
        try {
            const res = await fetch(`http://localhost:4000/admin/read`);
            if (!res.ok) throw new Error('Failed to fetch articles');
            const data = await res.json();
            setArticles(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        }
    }

    const createArticle = async(data:Omit<Article, "updatedAt" | "createdAt" | "uid">) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('body', data.body);
            formData.append('thumnailPath', data.thumnailPath);
            
            const res = await fetch(`http://localhost:4000/admin/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            
            if (!res.ok) throw new Error('Failed to create article');
            await readArticle(); // 記事作成後に一覧を更新
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        }
    }

    const selectArticle = async(uid:string) => {
        console.log(uid)    
        try {
            const res = await fetch(`http://localhost:4000/admin/article/${uid}`);
            if (!res.ok) throw new Error('Failed to select article');
            const data = await res.json();
            return data;
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        }
    }

    useEffect(() => {
        readArticle();
    }, []);

    return { articles, error, readArticle, createArticle, selectArticle }
}