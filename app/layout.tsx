// app/layout.tsx

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./styles/globals.css"; // Perbaiki path ke "./styles/globals.css"

// Menggunakan font Poppins
const poppins = Poppins({
  weight: ['400', '500', '600', '700'], // Anda bisa menyesuaikan dengan weight yang diperlukan
  subsets: ['latin'],
  variable: '--font-poppins', // Tentukan nama variabel font
});

export const metadata: Metadata = {
  title: "TRAPO Sales Community",
  description: "A community for TRAPO sales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
