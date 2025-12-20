// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Pastikan path ini benar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRAPO Sales Community",
  description: "A community for TRPO sales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // HANYA ADA SATU <html> DAN SATU <body> DI SELURUH APLIKASI
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}