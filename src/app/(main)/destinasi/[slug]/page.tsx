import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Clock, Globe, MapPin, Ticket, Star, ParkingCircle, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/shared/MapComponent";
import { ImageSlider } from "@/components/shared/ImageSlider";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";

// Tipe untuk parameter URL
type DestinasiDetailPageProps = {
  params: {
    slug: string;
  };
};

// Komponen untuk rating bintang
const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => (
    <div className="flex items-center gap-2">
        <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
        </div>
        <span className="font-bold text-lg">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">({reviewCount} Ulasan)</span>
    </div>
);

export default async function DestinasiDetailPage({ params }: DestinasiDetailPageProps) {
  const { slug } = params;
  const supabase = await createClient();

  // Ambil data user yang sedang login (jika ada)
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil data destinasi, kategori, dan foto-fotonya sekaligus
  const { data: destination, error } = await supabase
    .from("destinations")
    .select(`*, categories(name), destination_photos(photo_path)`)
    .eq("slug", slug)
    .single();

  if (error || !destination) {
    notFound();
  }

  // Ekstrak URL gambar dari data relasi
  const imageUrls = destination.destination_photos.map(photo => photo.photo_path);

  // Data dummy untuk rating (akan kita buat dinamis nanti)
  const rating = 4.8; 
  const reviewCount = 1800;

  return (
    <main>
      {/* Slider Gambar */}
      <ImageSlider images={imageUrls} />

      <div className="container mx-auto py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Kolom Konten Utama */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h1 className="text-4xl font-bold tracking-tight">{destination.name}</h1>
              <div className="flex items-center text-muted-foreground mt-2"><MapPin className="w-4 h-4 mr-2" />{destination.address}</div>
              <div className="mt-4"><StarRating rating={rating} reviewCount={reviewCount} /></div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm border-t pt-4">
                <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{destination.open_time}</div>
                <div className="flex items-center"><Ticket className="w-4 h-4 mr-2" />{destination.ticket_price}</div>
                {destination.website && <a href={destination.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Globe className="w-4 h-4 mr-2" />Website</a>}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Tentang Destinasi</h2>
              <p className="text-muted-foreground whitespace-pre-line">{destination.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Fasilitas</h2>
              <div className="flex flex-wrap gap-4">
                {destination.facilities?.map(facility => (
                  <div key={facility} className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-slate-50">
                    {facility === "Area Parkir" && <ParkingCircle className="w-4 h-4 text-muted-foreground" />}
                    {facility === "Warung Makan" && <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />}
                    {facility}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Ulasan Pengunjung</h2>
              {user ? (
                <ReviewForm destinationId={destination.id} userId={user.id} />
              ) : (
                <div className="text-center p-6 border-2 border-dashed rounded-lg mb-6">
                    <p className="text-muted-foreground">Anda harus login untuk memberikan ulasan.</p>
                </div>
              )}
              <ReviewList destinationId={destination.id} />
            </section>
          </div>

          {/* Kolom Sidebar */}
          <aside className="md:col-span-1 space-y-6 sticky top-24 h-fit">
            <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
                <div className="space-y-3"><Button className="w-full">Petunjuk Arah</Button><Button variant="outline" className="w-full">Hubungi</Button><Button variant="outline" className="w-full">Bagikan</Button></div>
            </div>
            {destination.lat && destination.lng && (
              <div className="h-64 rounded-lg overflow-hidden"><MapComponent lat={destination.lat} lng={destination.lng} /></div>
            )}
            <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Tips Berkunjung</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside"><li>Berpakaian sopan.</li><li>Jaga kebersihan.</li></ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}