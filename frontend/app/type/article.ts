// 新しいクラスモデルをre-export
export { Article } from '../models/Article';

// 後方互換性のため、型としても利用可能にする
export type ArticleType = InstanceType<typeof import('../models/Article').Article>;