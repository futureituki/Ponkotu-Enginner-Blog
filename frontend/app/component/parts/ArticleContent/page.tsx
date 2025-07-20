import { Article } from "@/app/type";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import styles from "@/app/component/parts/ArticleContent/page.module.css"
import { CodeBlock } from "@/app/component/parts/CodeBlock/page";
import { InlineCode } from "@/app/component/parts/InlineCode/page";

export const ArticleContent = ({ article }: { article: Article }) => {
        // カスタムコンポーネント
        const components = {
            h1: ({ children, ...props }: React.ComponentProps<'h1'>) => (
              <h1 {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }: React.ComponentProps<'h2'>) => (
              <h2{...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }: React.ComponentProps<'h3'>) => (
              <h3 {...props}>
                {children}
              </h3>
            ),
            h4: ({ children, ...props }: React.ComponentProps<'h4'>) => (
              <h4 {...props}>
                {children}
              </h4>
            ),
            h5: ({ children, ...props }: React.ComponentProps<'h5'>) => (
              <h5 {...props}>
                {children}
              </h5>
            ),
            h6: ({ children, ...props }: React.ComponentProps<'h6'>) => (
              <h6 {...props}>
                {children}
              </h6>
            ),
            p: ({ children, ...props }: React.ComponentProps<'p'>) => (
              <p {...props}>
                {children}
              </p>
            ),
            ul: ({ children, ...props }: React.ComponentProps<'ul'>) => (
              <ul {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }: React.ComponentProps<'ol'>) => (
              <ol {...props}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }: React.ComponentProps<'li'>) => (
              <li {...props}>
                {children}
              </li>
            ),
            blockquote: ({ children, ...props }: React.ComponentProps<'blockquote'>) => (
              <blockquote {...props}>
                {children}
              </blockquote>
            ),
            code: ({ children, className, ...props }: React.ComponentProps<'code'>) => {
              // インラインコードかブロックコードかを判定
              const isInline = !className || !className.includes('language-');
              return isInline ? (
                <InlineCode className={className} {...props}>
                  {children}
                </InlineCode>
              ) : (
                <CodeBlock className={className} {...props}>
                  {children}
                </CodeBlock>
              );
            },
            pre: ({ children, ...props }: React.ComponentProps<'pre'>) => (
              <div className={styles.preWrapper}>
                {children}
              </div>
            ),
            img: ({ src, alt, ...props }: React.ComponentProps<'img'>) => (
              <img 
                src={src} 
                alt={alt || ''} 
                {...props}
                className={styles.image}
              />
            ),
            a: ({ href, children, ...props }: React.ComponentProps<'a'>) => (
              <Link
                href={href || '/'}
                className={styles.link} 
                target="_blank" 
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </Link>
            ),
          };
  return (
    <div className={styles.layout}>
        <div className={styles.articleContainer}>
        <article className={styles.article}>
            <header className={styles.articleHeader}>
              <h1 className={styles.title}>{article.title}</h1>
              <div className={styles.meta}>
                <time className={styles.createdAt}>
                  投稿日: {article.getFormattedCreatedAt()}
                    </time>
                {article.isUpdated() && (
                  <time className={styles.updated}>
                    最終更新日: {article.getFormattedUpdatedAt()}
                  </time>
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
  )
}; 