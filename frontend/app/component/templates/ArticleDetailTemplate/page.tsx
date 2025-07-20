import styles from "@/app/component/templates/ArticleDetailTemplate/page.module.css"

export const ArticleDetailTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
        <div className={styles.layout}>
            {children}
        </div>
    </div>
  )
};