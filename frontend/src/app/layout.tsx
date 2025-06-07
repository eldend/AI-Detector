import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "AI Detector - 악성프로세스 탐지 시스템",
  description: "AI 기반 악성프로세스 탐지 및 모니터링 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-dark-DEFAULT min-h-screen text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
