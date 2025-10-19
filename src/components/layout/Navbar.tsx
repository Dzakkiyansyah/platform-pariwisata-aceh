import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server"; // <-- Impor Supabase Server Client
import { UserNav } from "@/components/shared/UserNav"; // <-- Impor komponen menu profil

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/destinasi", label: "Destinasi" },
  { href: "/berita", label: "Berita & Acara" },
  { href: "/tentang", label: "Tentang Kami" },
  
];

// Navbar sekarang menjadi 'async function' untuk mengambil data di server
export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userProfile = null;
  if (user) {
    // Ambil profil jika pengguna sudah login
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .single();
    userProfile = profile;
  }

  return (
    <header className="py-4 bg-[#1C2C4A] backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Bagian Kiri: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-white">Jelajah Aceh</span>
        </Link>

        {/* Navigasi (untuk layar besar) */}
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

        {/* Bagian Kanan (Sekarang Dinamis) */}
        <div className="flex items-center gap-4">
          {user && userProfile ? (
            // Jika user login, tampilkan menu profil
            <UserNav user={userProfile} />
          ) : (
            // Jika tidak login, tampilkan tombol dari desain Anda
            <>
              <Button asChild variant="ghost" className="h-10 px-4 text-sm text-gray-300 hover:text-white hover:bg-white/10">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="h-10 px-4 text-sm">
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};