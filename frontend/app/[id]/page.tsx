
import React from "react";

// ダミー記事データ
const dummyArticles = [
  {
    id: 1,
    title: "VALORANT攻略：エージェント別立ち回り解説",
    content: `各エージェントの特徴や立ち回りのコツを詳しく解説します。\n\n・ジェット：素早い移動で敵を翻弄しよう！\n・セージ：味方のサポートと回復がカギ。\n・オーメン：スモークで視界を遮りつつ裏取りを狙おう。`,
    date: "2024-06-01",
  },
  {
    id: 2,
    title: "パッチノート最新情報まとめ",
    content: `2024年5月28日パッチの主な変更点：\n\n・新エージェント追加\n・バランス調整\n・バグ修正`,
    date: "2024-05-28",
  },
  {
    id: 3,
    title: "おすすめ設定＆デバイス紹介",
    content: `プロも使うおすすめ設定やデバイスを紹介します。\n\n・マウス感度\n・クロスヘア設定\n・モニターリフレッシュレート`,
    date: "2024-05-20",
  },
];

const ArticleDetail = ({ params }: { params: { id: string } }) => {
  const article = dummyArticles.find(
    (a) => a.id === Number(params.id)
  );

  if (!article) {
    return <div>記事が見つかりませんでした。</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>{article.title}</h1>
      <div style={{ color: "#888", fontSize: 14, margin: "8px 0 24px 0" }}>{article.date}</div>
      <div style={{ fontSize: 18, whiteSpace: "pre-line" }}>{article.content}</div>
    </div>
  );
};

export default ArticleDetail;
