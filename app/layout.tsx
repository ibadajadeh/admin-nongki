import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nongki Admin - Coffee & Hangout Management Panel",
  description: "Modern Admin Panel for Nongki Cafe & Spots Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream-100 text-coffee-900 selection:bg-caramel-200 selection:text-coffee-900">
        {children}
      </body>
    </html>
  );
}
