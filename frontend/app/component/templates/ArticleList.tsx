import { Article as ArticleComponent } from "../parts/article";
import { Article as ArticleType } from "@/app/type/article";

export const ArticleList = ({articles}: {articles: ArticleType[]}) => {
  return (
    <div className="article-grid">
      {articles?.map((article) => (
        <ArticleComponent key={article.id} {...article} />
      ))}
    </div>
  );
};

