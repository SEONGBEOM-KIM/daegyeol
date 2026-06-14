import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대신 결정해드립니다",
  description: "선택에 어려움을 느끼는 사람을 위한 개인화 추천 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
