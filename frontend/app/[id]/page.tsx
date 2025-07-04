'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Home() {
  const { id } = useParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/articles")
      .then((res) => res.json())
      .then((data) => setStatus(JSON.stringify(data)))
      .catch((err) => setStatus(`API error ${err}`));
  }, []);

  return (
    <main>
      <h1>詳細ページ</h1>
      <p>Flask API: {id}</p>
    </main>
  );
}
