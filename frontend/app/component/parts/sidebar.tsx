import Image from 'next/image';
import styles from './sidebar.module.css';

export const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
                <div className={styles.profileImageWrapper}>
                    <Image
                        src="/profile.png"
                        alt="Profile"
                        width={120}
                        height={120}
                        className={styles.profileImage}
                        unoptimized
                    />
                </div>
                <h2 className={styles.profileName}>Itsuki Sato</h2>
                <p className={styles.profileBio}>
                    フルスタックエンジニア。React/Next.js, Python, TypeScriptを使った開発が得意です。
                    新しい技術を学ぶことが好きで、日々ブログを通じて情報発信しています。
                </p>
                <div className={styles.socialLinks}>
                    <a 
                        href="https://github.com/yourusername" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.githubLink}
                    >
                        <svg className={styles.githubIcon} viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.58 0-.287-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                        </svg>
                        GitHub
                    </a>
                </div>
            </div>
        </aside>
    );
}; 