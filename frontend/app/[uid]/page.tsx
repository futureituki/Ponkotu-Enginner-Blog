'use client'
import React, { useEffect, useState } from "react";
import { useArticle } from "../hook/useArticle";
import { Article } from "@/app/type/index";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { TableOfContents } from "../component/parts/TableOfContents";
import { generateTableOfContents } from "../utils/toc";
import styles from "./page.module.css";

const ArticleDetail = ({ params }: { params: Promise<{ uid: string }> }) => {
  const { selectArticle } = useArticle();
  const [article, setArticle] = useState<Article | null>(null);
  const [uid, setUid] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tocItems, setTocItems] = useState<any[]>([]);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUid(resolvedParams.uid);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (uid) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          setError(null);
          const article = await selectArticle(uid);
          setArticle(article);
          // 目次を生成
          const toc = generateTableOfContents(article.body);
          setTocItems(toc);
        } catch (err) {
          setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [uid]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>記事を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>エラーが発生しました</h2>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>記事が見つかりませんでした</h2>
          <p>お探しの記事は削除されたか、URLが間違っている可能性があります。</p>
          <a href="/" className={styles.backLink}>
            トップページに戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* サイドバー（目次） */}
        <aside className={styles.sidebar}>
          <TableOfContents items={tocItems} />
        </aside>

        {/* メインコンテンツ */}
        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <h1 className={styles.title}>{article.title}</h1>
            <div className={styles.meta}>
              <time className={styles.date}>
                {article.getFormattedCreatedAt()}
              </time>
              {article.isUpdated() && (
                <span className={styles.updated}>
                  (更新: {article.getFormattedUpdatedAt()})
                </span>
              )}
              <span className={styles.readingTime}>
                読了時間: 約{article.getEstimatedReadingTime()}分
              </span>
            </div>
          </header>
          
          <div className={styles.content}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }]
              ]}
              components={{
                h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
                h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
                h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
                h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
                h5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
                h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
                img: ({ alt, src, ...props }) => (
                  <img 
                    alt={alt} 
                    src={src} 
                    {...props}
                    className={styles.markdownImage}
                  />
                ),
                code: ({ inline, className, children, ...props }: any) => {
                  if (inline) {
                    return <code className={styles.inlineCode} {...props}>{children}</code>;
                  }
                  return (
                    <pre className={styles.codeBlock}>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                blockquote: ({ children, ...props }) => (
                  <blockquote className={styles.blockquote} {...props}>
                    {children}
                  </blockquote>
                ),
              }}
            >
              {article.body}
            </ReactMarkdown>
          </div>
          
          <footer className={styles.articleFooter}>
            <a href="/" className={styles.backLink}>
              ← 記事一覧に戻る
            </a>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
