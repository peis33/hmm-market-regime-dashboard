import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HMM 股市分析工作台",
  description: "使用 mock data 模擬 Hidden Markov Model 的市場狀態分析 dashboard。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
