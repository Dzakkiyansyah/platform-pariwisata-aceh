import { createClient } from "@/lib/supabase/server";
import DestinationCard from "../shared/DestinationCard";

// Tipe untuk data destinasi (tidak berubah)
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

// Tipe untuk hasil query: sebuah objek yang berisi properti 'destinations'
type BookmarkWithDestination = {
    destinations: Destination | null;
};

export default async function UserBookmarks({ userId }: { userId: string }) {
    const supabase = await createClient();
    
    // Ambil data bookmark beserta detail destinasinya
    const { data, error } = await supabase
        .from('bookmarks')
        .select('destinations(*, categories(name))')
        .eq('user_id', userId);
    
    if (error) {
        console.error("Bookmark fetch error:", error);
        return <p className="text-red-500">Gagal memuat destinasi tersimpan.</p>;
    }
    
    const typedData: BookmarkWithDestination[] = data || [];
    const bookmarks = typedData
        .map(b => b.destinations) 
        .filter((d): d is Destination => d !== null); 

    if (bookmarks.length === 0) {
        return <p className="text-muted-foreground text-center py-8">Anda belum menyimpan destinasi apapun.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((dest) => (
                <DestinationCard
                    key={dest.id}
                    slug={dest.slug}
                    imageUrl={dest.image_url || "/images/placeholder.jpg"}
                    name={dest.name}
                    address={dest.address}
                    category={dest.categories?.name || "Tanpa Kategori"}
                    openTime={dest.open_time}
                    ticketPrice={dest.ticket_price}
                />
            ))}
        </div>
    );
}