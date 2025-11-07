import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import {
  Clock,
  Globe,
  MapPin,
  Ticket,
  Star,
  ParkingCircle,
  UtensilsCrossed,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MapComponent from "@/components/shared/MapComponent";
import { ImageSlider } from "@/components/shared/ImageSlider";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import BookmarkButton from "@/components/shared/BookmarkButton";

// ==============================
// 🧩 Props Type
// ==============================
type DestinasiDetailPageProps = {
  params: Promise<{ slug: string }>;
};

// ==============================
// ⭐ Komponen Rating
// ==============================
const StarRating = ({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
    <span className="font-bold text-lg">{rating.toFixed(1)}</span>
    <span className="text-sm text-muted-foreground">
      ({reviewCount} Ulasan)
    </span>
  </div>
);

// ==============================
// 🏷️ Icon Fasilitas
// ==============================
const iconMap: { [key: string]: React.ElementType } = {
  "Area Parkir": ParkingCircle,
  "Warung Makan": UtensilsCrossed,
  Keamanan: ShieldCheck,
};

// ==============================
// 🏝️ Halaman Detail Destinasi
// ==============================
export default async function DestinasiDetailPage({
  params,
}: DestinasiDetailPageProps) {
  noStore(); // Selalu render ulang agar view tercatat

  const { slug } = await params; // ✅ FIX: wajib pakai 'await'
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: destination, error } = await supabase
    .from("destinations")
    .select(
      `*, categories(name), destination_photos(photo_path), reviews(count)`
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !destination) {
    notFound();
  }

  // Catat kunjungan user
  try {
    await supabase.from("destination_views").insert({
      destination_id: destination.id,
      user_id: user?.id || null,
    });
  } catch (viewError) {
    console.error("Error logging destination view:", viewError);
  }

  // Cek apakah sudah di-bookmark
  let isBookmarked = false;
  if (user) {
    const { data: bookmark } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("destination_id", destination.id)
      .single();
    if (bookmark) isBookmarked = true;
  }

  // Ambil rata-rata rating
  const { data: avgRatingData } = await supabase.rpc("get_average_rating", {
    dest_id: destination.id,
  });

  const imageUrls = (destination.destination_photos || []).map(
    (photo) => photo.photo_path
  );
  if (destination.image_url) imageUrls.unshift(destination.image_url);

  const reviewCount = destination.reviews[0]?.count ?? 0;
  const rating = avgRatingData ? parseFloat(avgRatingData.toFixed(1)) : 0.0;
  const tips: string[] = destination.tips || [];

  return (
    <main>
      <ImageSlider images={imageUrls} />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 md:-mt-48">
        <div className="relative bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="md:col-span-2 space-y-8">
              {/* Informasi Umum */}
              <section>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {destination.name}
                </h1>
                <div className="flex items-center text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {destination.address}
                </div>
                <div className="mt-4">
                  <StarRating rating={rating} reviewCount={reviewCount} />
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm border-t pt-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {destination.open_time || "N/A"}
                  </div>
                  <div className="flex items-center">
                    <Ticket className="w-4 h-4 mr-2" />
                    {destination.ticket_price || "N/A"}
                  </div>
                  {destination.website && (
                    <a
                      href={destination.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  )}
                </div>
              </section>

              {/* Tentang Destinasi */}
              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  Tentang Destinasi
                </h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                  {destination.description || "Deskripsi belum tersedia."}
                </div>
              </section>

              {/* Fasilitas */}
              <section>
                <h2 className="text-2xl font-semibold mb-3">Fasilitas</h2>
                <div className="flex flex-wrap gap-4">
                  {destination.facilities && destination.facilities.length > 0 ? (
                    destination.facilities.map((facility: string) => {
                      const Icon = iconMap[facility] || ShieldCheck;
                      return (
                        <Badge
                          key={facility}
                          variant="outline"
                          className="py-1 px-3 text-sm"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {facility}
                        </Badge>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Informasi fasilitas belum tersedia.
                    </p>
                  )}
                </div>
              </section>

              {/* Ulasan */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Ulasan Pengunjung
                </h2>
                {user ? (
                  <ReviewForm destinationId={destination.id} userId={user.id} />
                ) : (
                  <div className="text-center p-6 border-2 border-dashed rounded-lg mb-6">
                    <p className="text-muted-foreground">
                      Anda harus{" "}
                      <Link
                        href="/login"
                        className="font-semibold text-blue-600 underline"
                      >
                        login
                      </Link>{" "}
                      untuk memberikan ulasan.
                    </p>
                  </div>
                )}
                <ReviewList destinationId={destination.id} />
              </section>
            </div>

            
            <aside className="md:col-span-1 space-y-6 sticky top-24 h-fit">
              <Card className="shadow-none border">
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <BookmarkButton
                    destinationId={destination.id}
                    isBookmarked={isBookmarked}
                    isLoggedIn={!!user}
                  />
                  <Button asChild className="w-full">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Petunjuk Arah
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Bagikan
                  </Button>
                </CardContent>
              </Card>

              {destination.lat && destination.lng && (
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapComponent lat={destination.lat} lng={destination.lng} />
                </div>
              )}

              {tips.length > 0 && (
                <Card className="shadow-none border">
                  <CardHeader>
                    <CardTitle>Tips Berkunjung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      {tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
