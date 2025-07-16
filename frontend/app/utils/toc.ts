export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const generateTableOfContents = (markdownContent: string): TocItem[] => {
  if (!markdownContent) return [];

  // 見出しを抽出する正規表現（# ## ### #### ##### ######）
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdownContent)) !== null) {
    const level = match[1].length; // #の数
    const text = match[2].trim(); // 見出しテキスト
    
    // IDを生成（スペースをハイフンに、特殊文字を除去）
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 英数字、スペース、ハイフン以外を除去
      .replace(/\s+/g, '-') // スペースをハイフンに
      .replace(/--+/g, '-') // 連続するハイフンを1つに
      .replace(/^-|-$/g, ''); // 先頭末尾のハイフンを除去

    headings.push({
      id: id || `heading-${headings.length}`, // IDが空の場合はフォールバック
      text,
      level,
    });
  }

  return headings;
};

export const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 200; // ヘッダー分のオフセット
    const elementPosition = element.offsetTop - offset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
}; 