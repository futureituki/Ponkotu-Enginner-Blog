import Image from "next/image"
import styles from "@/app/component/parts/article.module.css";
import { Article as ArticleType } from "@/app/type/article";

export const Article = ({uid, thumnailPath, title, createdAt }: ArticleType) => {
    return (
        <div className={styles.articleContainer}>
            <div className={styles.cardGrid}>
                <a href={`/${uid}`} className={styles.card}>
                    <div className={styles.thumbnailWrapper}>
                        <Image 
                            src={thumnailPath || '/placeholder.jpg'} 
                            alt={title}
                            width={600}
                            height={338}
                            className={styles.thumbnail}
                            unoptimized
                        />
                    </div>
                    <div className={styles.cardContent}>
                        <h2 className={styles.cardTitle}>{title}</h2>
                        <div className={styles.cardDate}>{new Date(createdAt).toLocaleDateString()}</div>
                    </div>
                </a>
            </div>
        </div>
    )
}