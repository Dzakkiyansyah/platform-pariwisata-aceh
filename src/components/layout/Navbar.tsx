import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/destinasi", label: "Destinasi" },
  { href: "/berita", label: "Berita & Acara" },
  { href: "/tentang", label: "Tentang" },
  { href: "/hubungi", label: "Hubungi" },
];

const Navbar = () => {
  return (
    <header className="py-4 bg-[#1C2C4A] backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Bagian Kiri: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-white">Jelajah Aceh</span>
        </Link>

        {/*  Navigasi (untuk layar besar) */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bagian Kanan */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="h-10 px-4 text-sm text-gray-300 hover:text-white hover:bg-white/10">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="h-10 px-4 text-sm">Daftar</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;