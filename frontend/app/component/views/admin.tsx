'use client';

import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useArticle } from '@/app/hook/useArticle';

export const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [value, setValue] = useState("");
  const [title, setTitle] = useState('')
  const {article, readArticle, createArticle} = useArticle()

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

  if (isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h2>管理画面</h2>
        <button onClick={() => createArticle({ title, body: value, imagePath: '' })}>公開設定へ</button>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='タイトルを入力してください' />
        <MDEditor height={200} value={value} onChange={setValue} />
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

        {article?.map((data) => data.title)}
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