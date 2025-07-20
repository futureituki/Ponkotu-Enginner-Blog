import { useState, useCallback } from 'react';
import styles from '@/app/component/parts/CodeBlock/page.module.css';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const CodeBlock = ({ children, className, ...props }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(String(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  }, [children]);

  return (
    <div className={styles.codeBlockWrapper}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLanguage}>
          {className ? className.replace('language-', '') : 'text'}
        </span>
        <button 
          onClick={handleCopy}
          className={styles.copyButton}
          title="コードをコピー"
        >
          {copied ? (
            <span className={styles.copiedText}>コピー完了!</span>
          ) : (
            <svg className={styles.copyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
      <code className={`${styles.codeBlock} ${className || ''}`} {...props}>
        {children}
      </code>
    </div>
  );
}; 