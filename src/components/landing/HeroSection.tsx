// src/components/landing/HeroSection.tsx
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center text-white">
      {/* Gambar Latar Belakang */}
      <Image
        src="/images/hero-background.jpg" // <-- Ganti dengan gambar Anda di public/images
        alt="Museum Aceh"
        layout="fill"
        objectFit="cover"
        className="brightness-50" // <-- Memberi efek gelap pada gambar
      />

      {/* Konten Teks */}
      <div className="relative z-10 text-center space-y-4 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Jelajahi Pesona Otentik
          <br />
          <span className="text-blue-400">Banda Aceh</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
          Temukan destinasi terverifikasi, acara terbaru, dan ulasan terpercaya
          dalam satu platform resmi
        </p>
        <div className="pt-4">
          <Button asChild size="lg">
            <Link href="/destinasi">Jelajahi Sekarang →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;