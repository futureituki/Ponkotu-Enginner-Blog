import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/styles/globals.css";  
import "@/app/styles/variables.css";
import Header from "@/app/component/parts/header";
import { ThemeProvider } from "@/app/component/providers/ThemeProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Engineer's Blog",
  description: "Engineer's Blog",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon.svg",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        url: "/icon.svg", 
        sizes: "32x32",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "/icon.svg",
      sizes: "180x180",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
