'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/articles")
      .then((res) => res.json())
      .then((data) => setStatus(JSON.stringify(data)))
      .catch((err) => setStatus(`API error ${err}`));
  }, []);

  return (
    <main>
      <h1>Fullstack</h1>
      <p>Flask API: {status}</p>
    </main>
  );
}
