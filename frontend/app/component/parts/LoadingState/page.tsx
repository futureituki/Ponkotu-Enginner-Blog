import React from 'react';
import styles from './page.module.css';

export const LoadingState = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingText}>記事を読み込み中...</div>
    </div>
  );
}; 