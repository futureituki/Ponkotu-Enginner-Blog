import css from '@/app/component/parts/header.module.css'
import ThemeToggle from './ThemeToggle'

export default function Header() {
    return (
        <header className={css.header}>
            <div className={css.contents}>
              <div>
                <h1>ポンコツエンジニアブログ</h1>
                <p>未熟なエンジニアの成長を記録するブログ</p>
              </div>
                <ThemeToggle />
            </div>
        </header>
    )
}