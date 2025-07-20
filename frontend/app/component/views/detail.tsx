'use client'
import React, { useEffect, useState } from "react";
import { useArticle } from "@/app/hook/useArticle";
import { Article } from "@/app/type/index";
import { TableOfContents } from "@/app/component/parts/TableOfContents/page"
import { generateTableOfContents, TocItem } from "@/app/utils/toc";
import { ArticleContent } from "@/app/component/parts/ArticleContent/page";
import { ArticleDetailTemplate } from "@/app/component/templates/ArticleDetailTemplate/page";
import { LoadingState } from "@/app/component/parts/LoadingState/page";
import { ErrorState } from "@/app/component/parts/ErrorState/page";
import { NotFoundState } from "@/app/component/parts/NotFoundState/page";

export const ArticleDetailPage = ({ params}: { params: Promise<{ uid: string }> }) => {
    const { selectArticle } = useArticle();
    const [article, setArticle] = useState<Article | null>(null);
    const [uid, setUid] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
  
    useEffect(() => {
      const getParams = async () => {
        const resolvedParams = await params;
        setUid(resolvedParams.uid);
      };
      getParams();
    }, [params]);
  
    const handleSelectArticle = async (uid: string): Promise<Article> => { 
      const article = await selectArticle(uid);
      setArticle(article);
      return article 
    }
  
  
    useEffect(() => {
      if (uid) {
        const fetchArticle = async () => {
          try {
            setLoading(true);
            setError(null);
            const article = await handleSelectArticle(uid);
            setArticle(article);
            // 目次を生成
            const toc = generateTableOfContents(article.body);
            setTocItems(toc);
          } catch (err) {
            setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
          } finally {
            setLoading(false);
          }
        };
        fetchArticle();
      }
    }, [uid]);
  
    if (loading) {
      return <LoadingState />;
    }
  
    if (error) {
      return <ErrorState error={error} />;
    }
  
    if (!article) {
      return <NotFoundState />;
    }
  
    return (
        <ArticleDetailTemplate>
            <ArticleContent article={article} />
            <TableOfContents items={tocItems} />
        </ArticleDetailTemplate>
    );
};