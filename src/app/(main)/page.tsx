// src/app/(main)/page.tsx

// Import komponen-komponen UI (beberapa import tidak perlu lagi)
import HeroSection from "@/components/landing/HeroSection";
import CategoriesSection from "@/components/landing/CategoriesSection";
import ReviewSlider from "@/components/landing/ReviewSlider";
import CtaSection from "@/components/landing/CtaSection";
import DestinationCard from "@/components/shared/DestinationCard";
import NewsCard from "@/components/shared/NewsCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server"; // <-- 1. Impor Supabase Server Client

// --- KOMPONEN UTAMA HALAMAN (SEKARANG ASYNC) ---
export default async function Home() {
  // --- 2. HAPUS SEMUA DATA DUMMY DI SINI ---

  const supabase = createClient();

  // --- 3. AMBIL DATA DINAMIS DARI SUPABASE ---

  // Ambil 6 destinasi terbaru untuk bagian "Destinasi Terpopuler"
  const { data: popularDestinations, error: destinationsError } = await supabase
    .from("destinations")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })
    .limit(6);

  // Ambil 3 berita terbaru untuk bagian "Berita & Acara"
  const { data: latestNews, error: newsError } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  // Tampilkan pesan error jika pengambilan data gagal (opsional tapi baik untuk debugging)
  if (destinationsError) console.error("Error fetching popular destinations:", destinationsError.message);
  if (newsError) console.error("Error fetching latest news:", newsError.message);


  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      
      {/* === BAGIAN DESTINASI TERPOPULER (SEKARANG DINAMIS) === */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              Destinasi Terpopuler Pilihan Wisatawan
            </h2>
            <p className="text-muted-foreground mt-2">
              Tempat-tempat yang paling direkomendasikan berdasarkan ulasan dan
              rating terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 4. Gunakan data dari Supabase */}
            {popularDestinations?.map((dest: any) => (
              <DestinationCard
                key={dest.id}
                slug={dest.slug}
                imageUrl={dest.image_url} // <-- Sesuaikan nama kolom
                name={dest.name}
                address={dest.address} // <-- Ganti 'location' dengan 'address'
                category={dest.categories.name} // <-- Ambil dari relasi
                openTime={dest.open_time} // <-- Sesuaikan nama kolom
                ticketPrice={dest.ticket_price} // <-- Sesuaikan nama kolom
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/destinasi">Lihat Semua Destinasi</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* === BAGIAN BERITA & ACARA (SEKARANG DINAMIS) === */}
      <section className="container mx-auto py-16">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
            {/* ... (kode judul section tidak berubah) ... */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 5. Gunakan data dari Supabase */}
            {latestNews?.map((news) => (
              <NewsCard 
                  key={news.id}
                  slug={news.slug}
                  imageUrl={news.image_path || '/images/placeholder.jpg'} // <-- Sesuaikan nama kolom
                  title={news.title}
                  excerpt={news.content || ''} // <-- Sesuaikan nama kolom
                  date={new Date(news.created_at).toLocaleDateString('id-ID')}
                  author="Dinas Pariwisata" // <-- Nanti bisa diambil dari relasi user
              />
            ))}
        </div>
      </section>
      
      <ReviewSlider />
      <CtaSection />
    </main>
  );
}