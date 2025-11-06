import { createClient } from "@/lib/supabase/server";
import DestinationCard from "@/components/shared/DestinationCard";
import FilterControls from "@/components/shared/FilterControls";

type DestinasiPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

type Destination = {
  id: number;
  slug: string;
  image_url: string | null;
  name: string;
  address: string;
  open_time: string;
  ticket_price: string;
  categories: { name: string } | null;
  destination_photos?: { photo_path: string }[]; // Tambahan relasi foto
};

export default async function DestinasiPage({ searchParams }: DestinasiPageProps) {
  const supabase = await createClient();

  const searchTerm = typeof searchParams.q === "string" ? searchParams.q : "";
  const selectedCategoryName =
    typeof searchParams.category === "string" ? searchParams.category : "Semua Kategori";

  // Ambil daftar kategori
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("name")
    .order("name", { ascending: true });

  if (categoriesError) console.error("Error fetching categories:", categoriesError);

  // Ambil data destinasi + relasi kategori + foto
  let query = supabase.from("destinations").select(`
    id,
    slug,
    image_url,
    name,
    address,
    open_time,
    ticket_price,
    categories(name),
    destination_photos(photo_path)
  `);

  // Filter berdasarkan pencarian
  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  }

  // Filter berdasarkan kategori
  if (selectedCategoryName !== "Semua Kategori") {
    query = query.eq("categories.name", selectedCategoryName);
  }

  const { data, error: destinationsError } = await query;

  if (destinationsError) {
    console.error("Error fetching destinations:", destinationsError);
    return <div className="text-center py-16">Gagal memuat data destinasi.</div>;
  }

  const destinations: Destination[] = data || [];

  return (
    <main className="bg-slate-50">
      <div className="container mx-auto py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Jelajahi Semua Destinasi</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Temukan destinasi wisata menarik di Banda Aceh yang telah terverifikasi.
          </p>
        </div>

        {/* Filter */}
        <FilterControls categories={categories?.map((c) => c.name) || []} />

        {/* Grid */}
        {destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {destinations.map((dest) => {
              const imageUrl =
                dest.image_url ||
                dest.destination_photos?.[0]?.photo_path ||
                "/images/placeholder.jpg";

              return (
                <DestinationCard
                  key={dest.id}
                  slug={dest.slug}
                  imageUrl={imageUrl}
                  name={dest.name}
                  address={dest.address}
                  category={dest.categories?.name || "Tanpa Kategori"}
                  openTime={dest.open_time}
                  ticketPrice={dest.ticket_price}
                />
              );
            })}
          </div>
        ) : (
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
