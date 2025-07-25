import { ArticleComponent } from "@/app/component/parts/Article/page";
import { Article } from "@/app/type/index";
import styles from "@/app/component/templates/ArticleList/page.module.css"

export const ArticleList = ({articles}: {articles: Article[]}) => {
    return (
        <div className={styles.articleContainer}>
            <div className={styles.mainContent}>
                <div className={styles.cardGrid}>
                    {articles?.map((article) => (
                        <ArticleComponent key={article.uid} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
};

