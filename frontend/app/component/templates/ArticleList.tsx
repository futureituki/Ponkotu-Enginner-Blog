import { Article as ArticleComponent } from "@/app/component/parts/article";
import { Article as ArticleType } from "@/app/type/article";
import { Sidebar } from "@/app/component/parts/sidebar";
import styles from "@/app/component/templates/article_list.module.css";

export const ArticleList = ({articles}: {articles: ArticleType[]}) => {
    return (
        <div className={styles.articleContainer}>
            <div className={styles.mainContent}>
                <div className={styles.cardGrid}>
                    {articles?.map((article) => (
                        <ArticleComponent key={article.uid} {...article} />
                    ))}
                </div>
            </div>
        </div>
    );
};

