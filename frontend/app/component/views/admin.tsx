'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { useAdmin } from '@/app/hook/useAdmin';
import styles from './admin.module.css'; // CSSモジュールをインポート

// カテゴリのダミーデータ
const categories = [
  { value: 'technology', label: 'テクノロジー' },
  { value: 'design', label: 'デザイン' },
  { value: 'career', label: 'キャリア' },
  { value: 'productivity', label: '生産性' },
];

export const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [value, setValue] = useState<string | undefined>('');
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState(categories[0].value); // カテゴリ用のstate
  const { createArticle, articles, readArticle } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:4000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setIsAuthenticated(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
      } else {
        setMessage(data.message || '認証に失敗しました。');
        setIsAuthenticated(false);
      }
    } catch (err) {
      setMessage('ログインエラーが発生しました。' + err);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setMessage(null);
  };

  // カスタム画像挿入コマンド
  const imageUploadCommand = {
    name: 'imageUpload',
    keyCommand: 'imageUpload',
    buttonProps: { 'aria-label': 'Insert Image' },
    icon: (
      <svg width="12" height="12" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15.414 2H4.586A2.586 2.586 0 0 0 2 4.586v10.828A2.586 2.586 0 0 0 4.586 18h10.828A2.586 2.586 0 0 0 18 15.414V4.586A2.586 2.586 0 0 0 15.414 2zM4 4h12v7.586l-3.293-3.293a1 1 0 0 0-1.414 0L8 11.586l-1.293-1.293a1 1 0 0 0-1.414 0L4 11.586V4zm12 10.586a.586.586 0 0 1-.586.586H4.586a.586.586 0 0 1-.586-.586V12l2.293-2.293a1 1 0 0 0 1.414 0L11 13l3.293-3.293a1 1 0 0 0 1.414 0L16 10v4.586z"
        ></path>
      </svg>
    ),
    execute: () => {
      fileInputRef.current?.click();
    },
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:4000/admin/verify', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          readArticle();
        } else {
          handleLogout();
        }
      });
    }
  }, []);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:4000/upload_file', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      setThumbnail(json.url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleImageUploadInEditor = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:4000/upload_file', {
        method: 'POST',
        body: formData,
      });
      const imageUrl = await res.json();
      setValue((prev) => `${prev}\n\n![image](${imageUrl.url})`);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleSubmit = async (isPublished: boolean) => {
    try {
      await createArticle({
        title,
        body: value || '',
        thumnailPath: thumbnail,
        // isPublished, // API側での実装が必要
        // category, // API側での実装が必要
      });
      setValue('');
      setTitle('');
      setThumbnail('');
      alert(`記事を${isPublished ? '公開' : '下書き保存'}しました`);
      readArticle();
    } catch (err) {
      console.error('Failed to create article:', err);
      alert('記事の作成に失敗しました');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <h2>管理者ログイン</h2>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.loginInput}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.loginInput}
        />
        <button onClick={handleLogin} className={styles.loginButton}>
          ログイン
        </button>
        {message && <p className={styles.errorMessage}>{message}</p>}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.editorWrapper}>
        <header className={styles.header}>
          <h1>記事作成</h1>
          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.publishButton}`} onClick={() => handleSubmit(true)}>
              公開する
            </button>
            <button onClick={handleLogout} className={styles.button}>
              ログアウト
            </button>
          </div>
        </header>

        <main className={styles.main}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="記事のタイトル"
            className={styles.titleInput}
          />

          <section className={styles.metaSection}>
            <div className={styles.metaGroup}>
              <label htmlFor="category" className={styles.metaLabel}>カテゴリ</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.categorySelect}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.metaGroup}>
              <label className={styles.metaLabel}>サムネイル</label>
              <div className={styles.thumbnailUploader}>
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  onChange={handleThumbnailUpload}
                  accept="image/*"
                  className={styles.thumbnailInput}
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload" className={styles.thumbnailLabel}>
                  画像をアップロード
                </label>
                {thumbnail && (
                  <Image
                    src={thumbnail}
                    alt="Thumbnail preview"
                    width={120}
                    height={67}
                    className={styles.thumbnailPreview}
                    unoptimized
                  />
                )}
              </div>
            </div>
          </section>

          <div className={styles.editorContainer} data-color-mode="light">
            <MDEditor
              height={500}
              value={value}
              preview="live"
              onChange={(v) => setValue(v || '')}
              commands={[
                commands.bold,
                commands.italic,
                commands.strikethrough,
                commands.hr,
                commands.title,
                commands.divider,
                commands.link,
                commands.quote,
                commands.code,
                commands.codeBlock,
                imageUploadCommand,
              ]}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUploadInEditor}
            accept="image/*"
            hidden
          />
        </main>
      </div>

      <div className={styles.articleList}>
        <h2>投稿済み記事一覧</h2>
        {articles?.map((article) => (
          <div key={article.uid} className={styles.articleCard}>
            <h3>{article.title}</h3>
            <div className={styles.articleMeta}>
              <span>作成日: {article.getFormattedCreatedAt()}</span>
              {' | '}
              <span>約{article.getEstimatedReadingTime()}分</span>
              {article.isUpdated() && (
                <span> | 更新日: {article.getFormattedUpdatedAt()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};