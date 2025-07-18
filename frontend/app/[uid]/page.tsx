'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useArticle } from "../hook/useArticle";
import { Article } from "@/app/type/index";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { TableOfContents } from "@/app/component/parts/TableOfContents";
import { generateTableOfContents, TocItem } from "@/app/utils/toc";
import styles from "@/app/[uid]/page.module.css";

const ArticleDetail = ({ params }: { params: Promise<{ uid: string }> }) => {
  const { selectArticle } = useArticle();
  const [article, setArticle] = useState<Article | null>(null);
  const [uid, setUid] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUid(resolvedParams.uid);
    };
    getParams();
  }, [params]);

  const handleSelectArticle = async (uid: string): Promise<Article> => { 
    const article = await selectArticle(uid);
    setArticle(article);
    return article 
  }


  useEffect(() => {
    if (uid) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          setError(null);
          const article = await handleSelectArticle(uid);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">記事を読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">エラーが発生しました</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            トップページに戻る
          </Link>
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
          <Link href="/" className={styles.backLink}>
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  // カスタムコンポーネント
  const components = {
    h1: ({ children, ...props }: React.ComponentProps<'h1'>) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b-2 border-blue-500 pb-2" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: React.ComponentProps<'h2'>) => (
      <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4 border-b border-gray-300 pb-2" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: React.ComponentProps<'h3'>) => (
      <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: React.ComponentProps<'h4'>) => (
      <h4 className="text-xl font-semibold text-gray-800 mt-4 mb-2" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: React.ComponentProps<'h5'>) => (
      <h5 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: React.ComponentProps<'h6'>) => (
      <h6 className="text-base font-semibold text-gray-800 mt-3 mb-2" {...props}>
        {children}
      </h6>
    ),
    p: ({ children, ...props }: React.ComponentProps<'p'>) => (
      <p className="text-gray-700 leading-relaxed mb-4" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: React.ComponentProps<'ul'>) => (
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.ComponentProps<'ol'>) => (
      <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.ComponentProps<'li'>) => (
      <li className="ml-4" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }: React.ComponentProps<'blockquote'>) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 bg-gray-50 py-2" {...props}>
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }: React.ComponentProps<'code'>) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }: React.ComponentProps<'pre'>) => (
      <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4" {...props}>
        {children}
      </pre>
    ),
    img: ({ src, alt, ...props }: React.ComponentProps<'img'>) => (
      <img 
        src={src} 
        alt={alt || ''} 
        {...props}
      />
    ),
    a: ({ href, children, ...props }: React.ComponentProps<'a'>) => (
      <Link
        href={href || '/'}
        className="text-blue-600 hover:text-blue-800 underline" 
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </Link>
    ),
  };

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
              components={components}
                >
                  {article.body}
                </ReactMarkdown>
              </div>
          
          <footer className={styles.articleFooter}>
            <Link href="/" className={styles.backLink}>
              ← 記事一覧に戻る
            </Link>
          </footer>
            </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
