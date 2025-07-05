'use client';
import { useState } from "react"
import { Article } from "@/app/type/article"

export const useArticle = () => {
    const [article, setArticle] = useState<Article[]>([])
    const [error, setError] = useState<null | string>(null)

    const readArticle = () => {
        // ${process.env.BASE_URL}
        fetch(`http://localhost:4000/admin/read`).then((res: Response) => {
            console.log(res)
            if (res.ok) {
                return res.json();
            }
        }).then((data: Article[]) => {
            setArticle(data);
        }).catch((e) => {
            setError(e)
        })
    }

    const createArticle = async(data:Omit<Article, "updatedAt" | "createdAt" | "id">) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('body', data.body);
        formData.append('auth', localStorage.getItem('auth') || '');
        formData.append('imagePath', data.imagePath); // バックエンドで必要なので空文字を追加
        await fetch(`http://localhost:4000/admin/create`, {
            method: 'POST',
            body: formData
        }).then((res: Response) => {
            if (res.ok) {
                return res.json();
            }
        }).catch((e) => {
            setError(e)
        })
    }
    return { article, readArticle, createArticle }
}