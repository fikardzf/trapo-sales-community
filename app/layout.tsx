// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

// Gunakan font yang sama untuk seluruh app (login + dashboard)
const poppins = Poppins({
  subsets: ["latin"],
  weight : ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: 'swap',
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

      <body className={`${poppins.variable} antialiased`}>
        {children}
        </body>
    </html>
  )
}