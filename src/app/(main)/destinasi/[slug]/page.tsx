// src/app/destinasi/[slug]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, Globe, MapPin, Ticket, Star, Wifi, ParkingCircle, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/shared/MapComponent";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import Link from "next/link";

type DestinasiDetailPageProps = {
    params: {
        slug: string;
    }
}

// Komponen untuk menampilkan rating bintang (tidak berubah)
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

// --- 1. Ubah menjadi `async function` untuk mengambil data ---
export default async function DestinasiDetailPage({ params }: DestinasiDetailPageProps) {
    const { slug } = params;
    const supabase = createClient();

    // --- 2. Query untuk mengambil SATU destinasi dari Supabase ---
    const { data: destination, error } = await supabase
        .from('destinations')
        .select(`
            *,
            categories (name)
        `)
        .eq('slug', slug) // Cari yang slug-nya cocok
        .single(); // .single() untuk mengambil satu baris data saja

    // --- 3. Jika destinasi tidak ditemukan, tampilkan halaman 404 ---
    if (error || !destination) {
        notFound();
    }
    
    // Untuk data dummy fasilitas & ulasan (akan kita buat dinamis nanti)
    const facilities = ["Area Parkir", "Keamanan", "Warung Makan"]; 
    const rating = 4.8; 
    const reviewCount = 1800;

    return (
        <main>
            {/* Bagian Gambar Utama (Hero Image) */}
            <section className="relative h-[500px] w-full">
                <Image 
                    src={destination.image_url || '/images/placeholder.jpg'} // <-- 4. Gunakan data dari Supabase
                    alt={destination.name}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-75"
                />
            </section>
            
            <div className="container mx-auto py-12">
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    
                    {/* Kolom Kiri (Konten Utama) */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Header Destinasi */}
                        <section>
                            <h1 className="text-4xl font-bold tracking-tight">{destination.name}</h1>
                            <div className="flex items-center text-muted-foreground mt-2">
                                <MapPin className="w-4 h-4 mr-2" />
                                {destination.address}
                            </div>
                            <div className="mt-4">
                                {/* Nanti rating & review count ini akan kita buat dinamis */}
                                <StarRating rating={rating} reviewCount={reviewCount} />
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm border-t pt-4">
                                <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {destination.open_time}</div>
                                <div className="flex items-center"><Ticket className="w-4 h-4 mr-2" /> {destination.ticket_price}</div>
                                {destination.website && <a href={destination.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Globe className="w-4 h-4 mr-2" /> Website</a>}
                            </div>
                        </section>

                        {/* Tentang Destinasi */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3">Tentang Destinasi</h2>
                            <p className="text-muted-foreground whitespace-pre-line">{destination.description}</p>
                        </section>

                        {/* Fasilitas */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3">Fasilitas</h2>
                            <div className="flex flex-wrap gap-4">
                                {facilities.map(facility => (
                                    <div key={facility} className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-slate-50">
                                        {facility === "Area Parkir" && <ParkingCircle className="w-4 h-4 text-muted-foreground" />}
                                        {facility === "Keamanan" && <Wifi className="w-4 h-4 text-muted-foreground" />}
                                        {facility === "Warung Makan" && <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />}
                                        {facility}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Ulasan Pengunjung */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Ulasan Pengunjung</h2>
                          {/* Tampilkan form HANYA jika user sudah login */}
                            {user ? (
                            <ReviewForm destinationId={destination.id} userId={user.id} />
                            ) : (
                            <div className="text-center p-6 border-2 border-dashed rounded-lg mb-6">
                            <p className="text-muted-foreground">
                                Anda harus login terlebih dahulu untuk memberikan ulasan.
                            </p>
                            <Button asChild variant="link">
                            <Link href="/login">Login di sini</Link>
                            </Button>
                            </div>
                        )}
                            {/* Tampilkan daftar ulasan yang sudah ada */}
                                <ReviewList destinationId={destination.id} />
                                </section>
                    </div>
                    {/* Kolom Kanan (Sidebar) */}
                    <aside className="md:col-span-1 space-y-6 sticky top-24 h-fit">
                        {/* Aksi Cepat */}
                        <div className="p-4 border rounded-lg bg-white shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
                            <div className="space-y-3">
                                <Button className="w-full">Petunjuk Arah</Button>
                                <Button variant="outline" className="w-full">Hubungi</Button>
                                <Button variant="outline" className="w-full">Bagikan</Button>
                            </div>
                        </div>

                        {/* Peta Lokasi */}
                        {destination.lat && destination.lng && (
                            <div className="h-64 rounded-lg overflow-hidden">
                                <MapComponent lat={destination.lat} lng={destination.lng} />
                            </div>
                        )}

                        {/* Tips Berkunjung */}
                        <div className="p-4 border rounded-lg bg-white shadow-sm">
                            <h3 className="text-lg font-semibold mb-3">Tips Berkunjung</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                                <li>Berpakaian sopan dan menutup aurat.</li>
                                <li>Gunakan alas kaki yang nyaman.</li>
                                <li>Jaga kebersihan lingkungan sekitar.</li>
                            </ul>
                        </div>
                    </aside>

                </div>
            </div>
        </main>
    );
}