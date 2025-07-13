'use client';

import { useState, useEffect, useRef } from 'react';
import MDEditor, { ICommand, commands } from '@uiw/react-md-editor'
import { useArticle } from '@/app/hook/useArticle';
import { ArticleList } from '@/app/component/templates/ArticleList';

export const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [value, setValue] = useState("");
  const [title, setTitle] = useState('')
  const [thumbnail, setThumnail] = useState("")
  const {articles, readArticle, createArticle} = useArticle()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogin = async () => {
    const encoded = btoa(`${username}:${password}`);

    const res = await fetch('http://localhost:4000/admin/', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + encoded,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setMessage(data.message);
      setIsAuthenticated(true);
      // localStorage に保存（簡易認証状態）
      localStorage.setItem('auth', encoded);
    } else {
      setMessage('認証に失敗しました。');
      setIsAuthenticated(false);
    }
  };

    // カスタム画像挿入コマンド
  const imageUploadCommand: ICommand = {
      name: 'imageUpload',
      keyCommand: 'imageUpload',
      buttonProps: { 'aria-label': 'Insert Image' },
      icon: <span>🖼️</span>,
      execute: () => {
        fileInputRef.current?.click()
      }
    }

  // ページロード時に localStorage に保存された認証情報で自動ログイン
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    
    if (savedAuth) {
      fetch('http://localhost:4000/admin/', {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + savedAuth,
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setMessage(data.message);
            setIsAuthenticated(true);
          });
        }
      });
      readArticle()
    }
  }, []);

  const handleThumnailUpload = async(e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:4000/upload_file', {
        method:'POST',
        body:formData
    })
      const json = await res.json()
      setThumnail(json.url)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:4000/upload_file', {
        method:'POST',
        body:formData
    })
      const uploadImage = await res.json()
      // 記事内に画像を保存
      // setValue((prev) => `${prev}\n\n![image](${imageUrl.url})`)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  if (isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h2>管理画面</h2>
        <button onClick={() => createArticle({ title, body: value, thumnailPath: thumbnail })}>公開設定へ</button>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='タイトルを入力してください' />
        <div>
          <label htmlFor="thumnail">サムネイルをアップロード</label>
          <input
          name='thumnail'
          type="file"
          onChange={handleThumnailUpload}
          accept="image/*"
        />
        </div>
        <img src={thumbnail} />
        <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        hidden
      />
        <MDEditor height={200} value={value} preview="live" onChange={(v) => setValue(v || "")} commands={[
          commands.bold,
          commands.italic,
          commands.hr,
          commands.title,
          commands.link,
          commands.code,
          imageUploadCommand, // ← 追加
          // commands.preview,
        ]} />
        <button
          onClick={() => {
            localStorage.removeItem('auth');
            setIsAuthenticated(false);
            setUsername('');
            setPassword('');
            setMessage(null);
          }}
        >
          ログアウト
        </button>
        <ArticleList articles={articles} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h2>管理者ログイン</h2>
      <input
        type="text"
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <button onClick={handleLogin} style={{ padding: 10 }}>
        ログイン
      </button>
      {message && <p style={{ color: 'red', marginTop: 20 }}>{message}</p>}
    </div>
  );
}