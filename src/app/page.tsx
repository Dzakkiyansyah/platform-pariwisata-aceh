import HeroSection from "@/components/landing/HeroSection";
import DestinationCard from "@/components/shared/DestinationCard";
import NewsCard from "@/components/shared/NewsCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReviewSlider from '@/components/landing/ReviewSlider';
import CtaSection from '@/components/landing/CtaSection';
import CategoriesSection from "@/components/landing/CategoriesSection";

// --- DATA STATIS (DUMMY DATA) ---
// Nanti data ini akan kita ambil dari Supabase

const popularDestinations = [
  {
    slug: "masjid-raya-baiturrahman",
    imageUrl: "/images/masjid-raya.jpg",
    name: "Masjid Raya Baiturrahman",
    location: "Kec. Baiturrahman",
    category: "Wisata Religi",
  },
  {
    slug: "museum-tsunami",
    imageUrl: "/images/museum-tsunami.jpg",
    name: "Museum Tsunami",
    location: "Kota Banda Aceh",
    category: "Wisata Edukasi",
  },
  {
    slug: "pantai-lampuuk",
    imageUrl: "/images/pantai-lampuuk.jpg",
    name: "Pantai Lampuuk",
    location: "Kec. Lhoknga",
    category: "Wisata Alam",
  },
  {
    slug: "kapal-apung",
    imageUrl: "/images/pltd-apung.jpg",
    name: "PLTD Apung",
    location: "Kec. Kuta Alam",
    category: "Wisata Sejarah",
  },
  {
    slug: "museum-aceh",
    imageUrl: "/images/museum-aceh.jpg",
    name: "Museum Aceh",
    location: "Kec. Baiturrahman",
    category: "Wisata Budaya",
  },
  {
    slug: "pantai-ulee-lheue",
    imageUrl: "/images/ulee-lheue.jpg",
    name: "Pantai Ulee Lheue",
    location: "Kec. Meuraxa",
    category: "Wisata Alam",
  },
];

const latestNews = [
    {
        slug: "festival-kuliner-aceh-2025",
        imageUrl: "/images/berita-kuliner.jpg",
        title: "Festival Kuliner Aceh 2025 Resmi Dibuka",
        excerpt: "Dinas Pariwisata Banda Aceh menggelar festival kuliner terbesar tahun ini dengan 100+ stand makanan tradisional.",
        date: "12 Januari 2025",
        author: "Dinas Pariwisata"
    },
    {
        slug: "renovasi-museum-tsunami",
        imageUrl: "/images/berita-museum.jpg",
        title: "Renovasi Museum Tsunami Aceh Selesai",
        excerpt: "Museum Tsunami Aceh kini hadir dengan fasilitas yang lebih modern dan interaktif untuk pengunjung.",
        date: "13 Januari 2025",
        author: "Dinas Pariwisata"
    },
    {
        slug: "pantai-lampuuk-penghargaan",
        imageUrl: "/images/berita-pantai.jpg",
        title: "Pantai Lampuuk Raih Penghargaan Pantai Terbersih",
        excerpt: "Pantai Lampuuk berhasil meraih penghargaan pantai terbersih se-Sumatera dalam ajang pariwisata nasional.",
        date: "14 Januari 2025",
        author: "Dinas Pariwisata"
    }
];


// --- KOMPONEN UTAMA HALAMAN ---

export default function Home() {
  return (
    <main>
      {/* === HERO SECTION === */}
      <HeroSection />
      <CategoriesSection />
      {/* === BAGIAN DESTINASI TERPOPULER === */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto">
          {/* Judul Section */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              Destinasi Terpopuler Pilihan Wisatawan
            </h2>
            <p className="text-muted-foreground mt-2">
              Tempat-tempat yang paling direkomendasikan berdasarkan ulasan dan
              rating terbaik.
            </p>
          </div>

          {/* Grid Kartu Destinasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((dest) => (
              <DestinationCard
                key={dest.slug}
                slug={dest.slug}
                imageUrl={dest.imageUrl}
                name={dest.name}
                location={dest.location}
                category={dest.category}
              />
            ))}
          </div>

          {/* Tombol Lihat Semua */}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/destinasi">Lihat Semua Destinasi</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* === BAGIAN BERITA & ACARA === */}
      <section className="container mx-auto py-16">
        {/* Judul Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight">
              Berita & Acara Resmi dari Dinas Pariwisata
            </h2>
            <p className="text-muted-foreground mt-2">
              Update terbaru seputar pariwisata dan acara resmi di Banda Aceh
            </p>
          </div>
          <div className="text-center md:text-right">
            <Button asChild variant="outline">
              <Link href="/berita">Lihat semua Berita</Link>
            </Button>
          </div>
        </div>

        {/* Grid Kartu Berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((news) => (
                <NewsCard 
                    key={news.slug}
                    slug={news.slug}
                    imageUrl={news.imageUrl}
                    title={news.title}
                    excerpt={news.excerpt}
                    date={news.date}
                    author={news.author}
                />
            ))}
        </div>
      </section>
      <ReviewSlider />
      <CtaSection />
    </main>
  );
}