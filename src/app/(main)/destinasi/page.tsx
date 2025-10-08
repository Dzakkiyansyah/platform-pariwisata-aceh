import DestinationCard from "@/components/shared/DestinationCard";
import FilterControls from "@/components/shared/FilterControls";
import { createClient } from "@/lib/supabase/server";

// Tipe untuk props search params dari URL
type DestinasiPageProps = {
  searchParams: {
    q?: string;
    category?: string;
  };
};

export default async function DestinasiPage({ searchParams }: DestinasiPageProps) {
  const supabase = createClient();
  const searchTerm = searchParams.q || "";
  const selectedCategory = searchParams.category || "Semua Kategori";

  // --- 1. Ambil data KATEGORI untuk dropdown filter ---
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("name")
    .order("name", { ascending: true });

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
  }

  // --- 2. Bangun query untuk mengambil data DESTINASI ---
  let query = supabase.from("destinations").select(`
      *,
      categories (name)
    `);

  // Filter berdasarkan pencarian nama jika ada
  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  }

  // Filter berdasarkan kategori jika dipilih
  if (selectedCategory !== "Semua Kategori") {
    // @ts-ignore - Supabase JS client typing can be tricky with related tables
    query = query.eq("categories.name", selectedCategory);
  }

  // Eksekusi query destinasi
  const { data: destinations, error: destinationsError } = await query;

  if (destinationsError) {
    console.error("Error fetching destinations:", destinationsError);
    return (
      <div className="text-center py-16">Gagal memuat data destinasi.</div>
    );
  }

  return (
    <main className="bg-slate-50">
      <div className="container mx-auto py-16">
        {/* Header Halaman */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Jelajahi Semua Destinasi
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Temukan destinasi wisata menarik di Banda Aceh yang telah
            terverifikasi.
          </p>
        </div>

        {/* --- 3. Tampilkan komponen filter & kirim data kategori sebagai prop --- */}
        <FilterControls categories={categories?.map((c) => c.name) || []} />

        {/* Grid Daftar Destinasi */}
        {destinations && destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {destinations.map((dest: any) => (
              <DestinationCard
                key={dest.id}
                slug={dest.slug}
                imageUrl={dest.image_url}
                name={dest.name}
                address={dest.address}
                category={dest.categories.name}
                openTime={dest.open_time}
                ticketPrice={dest.ticket_price}
              />
            ))}
          </div>
        ) : (
          // Tampilan jika tidak ada hasil
          <div className="text-center col-span-full py-16">
            <h3 className="text-2xl font-semibold">Destinasi Tidak Ditemukan</h3>
            <p className="text-muted-foreground mt-2">
              Coba ubah kata kunci pencarian atau filter kategori Anda.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
