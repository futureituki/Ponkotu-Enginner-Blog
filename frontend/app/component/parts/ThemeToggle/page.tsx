'use client'

import { useTheme } from 'next-themes'
import styles from "@/app/component/parts/ThemeToggle/page.module.css"
import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // マウント後にUIを安全に表示するために使用しています
  useEffect(() => {
    setMounted(true)
  }, [])
  
  //サーバーとクライアントの両方で使用できるようにするために使用しています
  if (!mounted) {
    return null
  }
  return (
    <button
      className={`${styles.switch} ${theme === 'dark' ? styles.dark : styles.light}`}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="テーマを切り替え"
    >
      <div className={styles.switchTrack}>
        <div className={styles.switchThumb}>
          {theme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M3 12a9 9 0 0013.5 6.5M12 3a9 9 0 00-9 9"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
} 