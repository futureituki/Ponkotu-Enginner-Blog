import styles from "@/app/component/parts/Header/page.module.css"
import { ThemeToggle } from '@/app/component/parts/ThemeToggle/page'

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.contents}>
              <div>
                <h1>ポンコツエンジニアブログ</h1>
                <p>未熟なエンジニアの成長を記録するブログ</p>
              </div>
                <ThemeToggle />
            </div>
        </header>
    )
} 