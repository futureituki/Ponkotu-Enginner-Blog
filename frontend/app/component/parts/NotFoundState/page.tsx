import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export const NotFoundState = () => {
  return (
    <div className={styles.container}>
      <div className={styles.notFound}>
        <h2>記事が見つかりませんでした</h2>
        <p>お探しの記事は削除されたか、URLが間違っている可能性があります。</p>
        <Link href="/" className={styles.backLink}>
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}; 