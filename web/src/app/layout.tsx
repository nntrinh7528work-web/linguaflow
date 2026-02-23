import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinguaFlow — Học ngôn ngữ thông minh",
  description:
    "Ứng dụng học tiếng Nhật và tiếng Anh hiệu quả với Pomodoro, AI, và hệ thống ghi chú thông minh.",
};

/**
 * Root layout — wraps the entire application.
 * Loads Inter font via CSS import in globals.css.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
