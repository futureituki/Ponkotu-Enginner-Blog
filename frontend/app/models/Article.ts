interface ArticleData {
  uid?: string;
  title: string;
  body: string;
  thumnailPath?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponseData {
  uid: string;
  title: string;
  body: string;
  thumnailPath?: string;
  createdAt: string;
  updatedAt?: string;
}

export class Article {
  uid: string;
  title: string;
  body: string;
  thumnailPath?: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: ArticleData) {
    this.uid = data.uid || '';
    this.title = data.title;
    this.body = data.body;
    this.thumnailPath = data.thumnailPath;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // 静的メソッド：APIレスポンスからArticleインスタンスを作成
  static fromApiResponse(data: ApiResponseData): Article {
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
  static fromApiResponseArray(dataArray: ApiResponseData[]): Article[] {
    return dataArray.map(data => Article.fromApiResponse(data));
  }

  // 記事の作成日を日本語形式で取得
  getFormattedCreatedAt(): string {
    return new Date(this.createdAt).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 記事の更新日を日本語形式で取得
  getFormattedUpdatedAt(): string {
    return new Date(this.updatedAt).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 記事が更新されているかチェック
  isUpdated(): boolean {
    return this.createdAt !== this.updatedAt;
  }

  // 記事の読了時間を計算（分）
  getEstimatedReadingTime(): number {
    const wordsPerMinute = 400; // 日本語の平均読書速度
    const wordCount = this.body.length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, readingTime); // 最低1分
  }

  // 記事の概要を取得
  getSummary(maxLength: number = 100): string {
    if (this.body.length <= maxLength) return this.body;
    return this.body.substring(0, maxLength) + '...';
  }

  // 記事の文字数を取得
  getCharacterCount(): number {
    return this.body.length;
  }

  // 記事が空かどうかチェック
  isEmpty(): boolean {
    return !this.title.trim() || !this.body.trim();
  }

  // 記事のバリデーション
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.title.trim()) {
      errors.push('タイトルは必須です');
    }
    if (this.title.length > 100) {
      errors.push('タイトルは100文字以内で入力してください');
    }
    if (!this.body.trim()) {
      errors.push('本文は必須です');
    }
    if (this.body.length > 50000) {
      errors.push('本文は50000文字以内で入力してください');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // FormDataに変換（ファイルアップロード用）
  toFormData(): FormData {
    const formData = new FormData();
    formData.append('uid', this.uid);
    formData.append('title', this.title);
    formData.append('body', this.body);
    if (this.thumnailPath) {
      formData.append('thumnailPath', this.thumnailPath);
    }
    formData.append('createdAt', this.createdAt);
    formData.append('updatedAt', this.updatedAt);
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
      updatedAt: this.updatedAt
    };
  }

  // 記事のコピーを作成
  clone(): Article {
    return new Article({
      uid: this.uid,
      title: this.title,
      body: this.body,
      thumnailPath: this.thumnailPath,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
  }

  // 記事を更新
  update(data: Partial<ArticleData>): Article {
    return new Article({
      uid: this.uid,
      title: data.title ?? this.title,
      body: data.body ?? this.body,
      thumnailPath: data.thumnailPath ?? this.thumnailPath,
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString()
    });
  }
} 