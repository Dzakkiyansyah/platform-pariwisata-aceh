// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Platform Digital Pariwisata Banda Aceh",
  description: "Jelajahi Pesona Otentik Banda Aceh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}