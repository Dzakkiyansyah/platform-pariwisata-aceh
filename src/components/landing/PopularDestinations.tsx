import { createClient } from "@/lib/supabase/server";
import DestinationCard from "@/components/shared/DestinationCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PopularDestinations() {
  const supabase = await createClient();

  const { data: popularDestinations, error } = await supabase
    .from("destinations")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching popular destinations:", error.message);
    return null;
  }

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Destinasi Terpopuler Pilihan Wisatawan
          </h2>
          <p className="text-muted-foreground mt-2">
            Tempat-tempat yang paling direkomendasikan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularDestinations?.map((dest: any) => (
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

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/destinasi">Lihat Semua Destinasi</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}