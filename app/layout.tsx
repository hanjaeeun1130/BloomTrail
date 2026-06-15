import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "BloomTrail | 국내 수목원 맞춤 관람 코스 추천",
  description: "국내 수목원 검색 기반 맞춤 관람 코스 추천 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="page-shell">{children}</main>
      </body>
    </html>
  );
}
