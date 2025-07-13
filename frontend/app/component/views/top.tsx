'use client'
import { ArticleList } from "@/app/component/templates/ArticleList";
import { useArticle } from "@/app/hook/useArticle";
import { useEffect } from "react";

export const TopPage = () => {
  const { articles } = useArticle();

  return (
    <div>
      <ArticleList articles={articles} />
    </div>
  );
};