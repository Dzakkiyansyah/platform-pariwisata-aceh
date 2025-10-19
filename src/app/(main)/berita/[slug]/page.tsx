import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Tipe untuk parameter URL
type DetailBeritaPageProps = {
  params: {
    slug: string;
  };
};

export default async function DetailBeritaPage({ params }: DetailBeritaPageProps) {
  const { slug } = params;
  const supabase = await createClient();

  // Ambil data satu berita berdasarkan slug
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();

  // Jika berita tidak ditemukan, tampilkan halaman 404
  if (error || !news) {
    notFound();
  }

  return (
    <main className="bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <article className="space-y-6">
          {/* Judul dan Informasi Meta */}
          <header className="space-y-4">
            <Badge variant="outline">{/* Nanti bisa diisi kategori berita */ "Berita"}</Badge>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              {news.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Dinas Pariwisata</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={news.created_at}>
                  {new Date(news.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          </header>

          {/* Gambar Utama */}
          {news.image_path && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={news.image_path}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Isi Konten Artikel */}
          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
            {news.content}
          </div>
        </article>
      </div>
    </main>
  );
}