'use client'
import React, { useEffect, useState } from "react";
import { useArticle } from "../hook/useArticle";
import { Article } from "../type/article";

const ArticleDetail = ({ params }: { params: Promise<{ uid: string }> }) => {
  const { selectArticle } = useArticle();
  const [article, setArticle] = useState<Article | null>(null);
  const [uid, setUid] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUid(resolvedParams.uid);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (uid) {
      const fetchArticle = async () => {
        const article = await selectArticle(uid);
        setArticle(article);
      };
      fetchArticle();
    }
  }, [uid]);

  if (!article) {
    return <div>記事が見つかりませんでした。</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <div>{article.body}</div>
    </div>
  );
};

export default ArticleDetail;
