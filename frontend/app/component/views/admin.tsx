'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MDEditor, { commands } from '@uiw/react-md-editor'
import { useArticle } from '@/app/hook/useArticle';

export const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [value, setValue] = useState("");
  const [title, setTitle] = useState('')
  const [thumbnail, setThumnail] = useState("")
  const {articles, readArticle, createArticle, selectArticle, refreshArticles} = useArticle()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:4000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        setIsAuthenticated(true);
        // JWTトークンをlocalStorageに保存
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
      } else {
        setMessage(data.message || '認証に失敗しました。');
        setIsAuthenticated(false);
      }
    } catch (error) {
      setMessage('ログインエラーが発生しました。');
      setIsAuthenticated(false);
    }
  };

  // カスタム画像挿入コマンド
  const imageUploadCommand: any = {
    name: 'imageUpload',
    keyCommand: 'imageUpload',
    buttonProps: { 'aria-label': 'Insert Image' },
    icon: <span>🖼️</span>,
    execute: () => {
      fileInputRef.current?.click()
    }
  }

  // ページロード時にトークンの検証
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      fetch('http://localhost:4000/admin/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setMessage(data.message);
            setIsAuthenticated(true);
          });
        } else {
          // トークンが無効な場合は削除
          localStorage.removeItem('token');
          localStorage.removeItem('username');
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
        <button onClick={refreshArticles}>最新データを取得</button>
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
        <Image
                            src={thumbnail || '/placeholder.jpg'} 
                            alt={title}
                            width={320}
                            height={180}
                            unoptimized
                        />
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
        ]} />
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setIsAuthenticated(false);
            setUsername('');
            setPassword('');
            setMessage(null);
          }}
        >
          ログアウト
        </button>

        {articles?.map((data) => (
          <div key={data.uid}>{data.title}</div>
        ))}
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