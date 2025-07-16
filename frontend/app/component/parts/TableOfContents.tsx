'use client'
import React, { useState, useEffect } from 'react';
import { TocItem, scrollToHeading } from '@/app/utils/toc';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  items: TocItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0.1,
      }
    );

    // 見出し要素を監視
    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    scrollToHeading(id);
  };

  return (
    <nav className={styles.toc}>
      <div className={styles.header}>
        <h3 className={styles.title}>目次</h3>
        <button
          className={styles.toggleButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? '目次を展開' : '目次を折りたたむ'}
        >
          <span className={`${styles.icon} ${isCollapsed ? styles.iconRotated : ''}`}>
            ▼
          </span>
        </button>
      </div>
      
      <div className={`${styles.content} ${isCollapsed ? styles.collapsed : ''}`}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li
              key={item.id}
              className={`${styles.item} ${styles[`level${item.level}`]}`}
            >
              <button
                className={`${styles.link} ${
                  activeId === item.id ? styles.active : ''
                }`}
                onClick={() => handleClick(item.text)}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}; 