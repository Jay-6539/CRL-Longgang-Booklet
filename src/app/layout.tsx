import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRL Longgang Flipbook",
  description: "Customizable flipbook viewer with performance-first defaults."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
