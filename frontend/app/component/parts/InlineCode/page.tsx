import styles from '@/app/component/parts/InlineCode/page.module.css';

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const InlineCode = ({ children, className, ...props }: InlineCodeProps) => (
  <code className={`${styles.inlineCode} ${className || ''}`} {...props}>
    {children}
  </code>
); 