import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import I18nProvider from "@/components/I18nProvider";

export const metadata: Metadata = {
  title: "Gau Microservices Documentation",
  description: "Tài liệu hệ thống microservices Gau - Kiến trúc, API và triển khai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <I18nProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
