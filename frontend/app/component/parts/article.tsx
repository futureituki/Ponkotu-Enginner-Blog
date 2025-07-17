import Image from "next/image"
import styles from "@/app/component/parts/article.module.css";
import { Article } from "@/app/type/index";

export const ArticleComponent = ({ article }: { article: Article }) => {
    return (
        <div className={styles.articleContainer}>
            <div className={styles.cardGrid}>
                <a href={`/${article.uid}`} className={styles.card}>
                    <div className={styles.thumbnailWrapper}>
                        <Image 
                            src={article.thumnailPath || '/placeholder.jpg'} 
                            alt={article.title}
                            width={600}
                            height={338}
                            className={styles.thumbnail}
                            unoptimized
                        />
                    </div>
                    <div className={styles.cardContent}>
                        <h2 className={styles.cardTitle}>{article.title}</h2>
                        <div className={styles.cardMeta}>
                            <div className={styles.cardDate}>{article.getFormattedCreatedAt()}</div>
                            <div className={styles.readingTime}>
                                約{article.getEstimatedReadingTime()}分
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    )
}