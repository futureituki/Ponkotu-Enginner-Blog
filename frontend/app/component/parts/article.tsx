import Image from "next/image"
import styles from "@/app/component/parts/article.module.css";
import { Article as ArticleType } from "@/app/type/article";

export const Article = ({id, thumnailPath, body, title, createdAt }: ArticleType) => {
    return (
        <div className={styles.articleContainer}>
            <div className={styles.cardGrid}>
                <a href={`/${id}`} className={styles.card}>
                    <div className={styles.thumbnailWrapper}>
                        <Image 
                            src={thumnailPath || '/placeholder.jpg'} 
                            alt={title}
                            width={320}
                            height={180}
                            className={styles.thumbnail}
                            unoptimized
                        />
                    </div>
                    <div className={styles.cardContent}>
                        <div className={styles.cardDate}>{new Date(createdAt).toLocaleDateString()}</div>
                        <h2 className={styles.cardTitle}>{title}</h2>
                        <p className={styles.cardSummary}>{body}</p>
                    </div>
                </a>
            </div>
        </div>
    )
}