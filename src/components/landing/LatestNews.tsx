import { createClient } from "@/lib/supabase/server";
import NewsCard from "@/components/shared/NewsCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LatestNews() {
  const supabase = await createClient();

  const { data: latestNews, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching latest news:", error.message);
    return null;
  }

  return (
    <section className="container mx-auto py-16">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight">
            Berita & Acara Resmi
          </h2>
          <p className="text-muted-foreground mt-2">
            Update terbaru seputar pariwisata di Banda Aceh.
          </p>
        </div>
        <div className="text-center md:text-right">
          <Button asChild variant="outline">
            <Link href="/berita">Lihat semua Berita</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestNews?.map((news) => (
          <NewsCard
            key={news.id}
            slug={news.slug}
            imageUrl={news.image_path || '/images/placeholder.jpg'}
            title={news.title}
            excerpt={news.content || ''}
            date={new Date(news.created_at).toLocaleDateString('id-ID')}
            author="Dinas Pariwisata"
          />
        ))}
      </div>
    </section>
  );
}