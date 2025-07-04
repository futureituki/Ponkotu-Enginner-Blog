import css from '@/app/component/parts/header.module.css'

export default function Header() {
    return (
        <header className={css.header}>
            <div className={css.contents}>
              <div className={css.title}>
                <h1>ポンコツエンジニアブログ</h1>
                <p>未熟なエンジニアの成長を記録するブログ</p>
              </div>
              <div className={css.nav}></div>
            </div>
        </header>
    )
}