export class Article {
  uid: string;
  title: string;
  body: string;
  thumnailPath: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<Article> = {}) {
    this.uid = data.uid || '';
    this.title = data.title || '';
    this.body = data.body || '';
    this.thumnailPath = data.thumnailPath || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // 静的メソッド：APIレスポンスからArticleインスタンスを作成
  static fromApiResponse(data: any): Article {
    return new Article({
      uid: data.uid,
      title: data.title,
      body: data.body,
      thumnailPath: data.thumnailPath,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  // 静的メソッド：複数のAPIレスポンスからArticleインスタンス配列を作成
  static fromApiResponseArray(dataArray: any[]): Article[] {
    return dataArray.map(data => Article.fromApiResponse(data));
  }

  // 記事の作成日を日本語形式で取得
  getFormattedCreatedAt(): string {
    return new Date(this.createdAt).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // 記事の更新日を日本語形式で取得
  getFormattedUpdatedAt(): string {
    return new Date(this.updatedAt).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // 記事が更新されたかどうかを判定
  isUpdated(): boolean {
    return this.updatedAt !== this.createdAt;
  }

  // 記事の概要を取得（先頭100文字）
  getSummary(length: number = 100): string {
    if (this.body.length <= length) {
      return this.body;
    }
    return this.body.substring(0, length) + '...';
  }

  // 記事の読み取り時間を推定（日本語：400文字/分）
  getEstimatedReadingTime(): number {
    const wordsPerMinute = 400;
    const words = this.body.length;
    return Math.ceil(words / wordsPerMinute);
  }

  // バリデーション
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.title.trim()) {
      errors.push('タイトルは必須です');
    }

    if (!this.body.trim()) {
      errors.push('本文は必須です');
    }

    if (this.title.length > 200) {
      errors.push('タイトルは200文字以内で入力してください');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // FormData形式で出力（API送信用）
  toFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('body', this.body);
    formData.append('thumnailPath', this.thumnailPath);
    return formData;
  }

  // JSON形式で出力
  toJSON(): object {
    return {
      uid: this.uid,
      title: this.title,
      body: this.body,
      thumnailPath: this.thumnailPath,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // 記事のクローンを作成
  clone(): Article {
    return new Article(this.toJSON());
  }

  // 記事を更新
  update(data: Partial<Omit<Article, 'uid' | 'createdAt'>>): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.body !== undefined) this.body = data.body;
    if (data.thumnailPath !== undefined) this.thumnailPath = data.thumnailPath;
    if (data.updatedAt !== undefined) this.updatedAt = data.updatedAt;
    else this.updatedAt = new Date().toISOString();
  }
} 