import { createClient } from "@/lib/supabase/server";
import DestinationCard from "../shared/DestinationCard";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Destination = {
  id: number;
  slug: string;
  image_url: string | null;
  name: string;
  address: string;
  open_time: string;
  ticket_price: string;
  categories: { name: string } | null;
};

export default async function PopularDestinations() {
  const supabase = await createClient();
  const { data: popularDestinations, error } = await supabase
    .from("destinations")
    .select("*, categories(name)")
    .eq("status", "published")
    .limit(6);

  if (error) {
    console.error("Error fetching popular destinations:", error);
  }

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Destinasi Paling Populer
          </h2>
          <p className="text-muted-foreground mt-2">
            Tempat-tempat yang paling sering dikunjungi dan disukai oleh para
            wisatawan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularDestinations?.map((dest: Destination) => (
            <DestinationCard
              key={dest.id}
              slug={dest.slug}
              // --- PERBAIKAN DI SINI ---
              // Jika dest.image_url kosong, gunakan placeholder
              imageUrl={dest.image_url || "/images/placeholder.jpg"}
              name={dest.name}
              address={dest.address}
              category={dest.categories?.name || "Tanpa Kategori"}
              openTime={dest.open_time}
              ticketPrice={dest.ticket_price}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/destinasi">
              Lihat Semua Destinasi <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}