// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./style/globals.css";
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer"; 
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jelajahi Banda Aceh",
  description: "Platform Digital Pariwisata Kota Banda Aceh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster richColors />
      </body>
    </html>
  );
}