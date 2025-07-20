import { ArticleDetailPage } from "@/app/component/views/detail";

const ArticleDetail = ({ params }: { params: Promise<{ uid: string }> }) => {
  return <ArticleDetailPage params={params} />;
};

export default ArticleDetail;
