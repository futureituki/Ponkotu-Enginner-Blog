import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.errorContent}>
        <div className={styles.errorTitle}>エラーが発生しました</div>
        <div className={styles.errorMessage}>{error}</div>
        <Link href="/" className={styles.backLink}>
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}; 