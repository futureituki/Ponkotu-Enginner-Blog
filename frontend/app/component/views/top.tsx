'use client'
import { ArticleList } from "@/app/component/templates/ArticleList";
import { useArticle } from "@/app/hook/useArticle";
import { Sidebar } from "@/app/component/parts/sidebar";
import styles from "@/app/component/views/top.module.css";

export const TopPage = () => {
  const { articles } = useArticle();

  return (
    <div className={styles.topPageContainer}>
      <ArticleList articles={articles} />
      <Sidebar />
    </div>
  );
};