import { createClient } from "@/lib/supabase/server";
import NewsCard from "@/components/shared/NewsCard";

// Definisikan tipe untuk data berita
type News = {
    id: number;
    slug: string;
    title: string;
    content: string | null;
    image_path: string | null;
    created_at: string;
};

export default async function BeritaPage() {
    const supabase = await createClient();

    // Ambil semua berita, diurutkan dari yang terbaru
    const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching news:", error);
        return <div className="text-center py-16">Gagal memuat data berita.</div>;
    }

    const allNews: News[] = data || [];

    return (
        <main className="bg-slate-50">
            <div className="container mx-auto py-16">
                {/* Header Halaman */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Berita & Acara Terbaru
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Ikuti perkembangan terbaru seputar pariwisata dan acara resmi di Banda Aceh.
                    </p>
                </div>

                {/* Grid Daftar Berita */}
                {allNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allNews.map((news) => (
                        <NewsCard
                            key={news.id}
                            slug={news.slug}
                            imageUrl={news.image_path || "/images/placeholder.jpg"}
                            title={news.title}
                            excerpt={news.content || ""}
                            date={new Date(news.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                            author="Dinas Pariwisata"
                        />
                        ))}
                    </div>
                ) : (
                    <div className="text-center col-span-full py-16">
                        <h3 className="text-2xl font-semibold">Belum Ada Berita</h3>
                        <p className="text-muted-foreground mt-2">
                            Tidak ada berita atau acara yang dipublikasikan saat ini.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}