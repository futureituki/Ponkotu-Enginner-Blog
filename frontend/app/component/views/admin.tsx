'use client';

import { useState, useEffect } from 'react';

export const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      fetch('http://localhost:5000/admin/', {
        method: 'GET',
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
    }
  }, []);

  if (isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h2>管理画面</h2>
        <p>{message}</p>
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