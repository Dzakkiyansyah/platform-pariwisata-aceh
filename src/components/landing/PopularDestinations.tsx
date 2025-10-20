import { createClient } from "@/lib/supabase/server";
import DestinationCard from "../shared/DestinationCard";
import { Button } from "../ui/button";
import Link from "next/link";

type Destination = {
  id: number;
  slug: string;
  image_url: string | null;
  name: string;
  address: string;
  open_time: string;
  ticket_price: string;
  categories: { name: string } | null;
  destination_photos?: { photo_path: string }[]; 
};

export default async function PopularDestinations() {
  const supabase = await createClient();

  // Ambil 6 destinasi yang sudah dipublish, include relasi foto
  const { data: popularDestinations, error } = await supabase
    .from("destinations")
    .select("id, slug, image_url, name, address, open_time, ticket_price, categories(name), destination_photos(photo_path)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching popular destinations:", error);
  }

  const destinations: Destination[] = popularDestinations || [];

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Destinasi Terpopuler Pilihan Wisatawan
          </h2>
          <p className="text-muted-foreground mt-2">
            Tempat-tempat yang paling direkomendasikan berdasarkan ulasan dan rating terbaik.
          </p>
        </div>

        {/* Kartu destinasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => {
            // Ambil image utama dari tabel utama, kalau kosong ambil dari foto pertama
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

        {/* Tombol lihat semua */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/destinasi">Lihat Semua Destinasi</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
