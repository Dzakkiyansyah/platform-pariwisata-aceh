import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

// Komponen kecil untuk menampilkan bintang
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

// Tipe untuk props komponen
type ReviewListProps = {
  destinationId: number;
}

export default async function ReviewList({ destinationId }: ReviewListProps) {
  const supabase = createClient();

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*') // Nanti kita bisa join dengan tabel user
    .eq('destination_id', destinationId)
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-red-500">Gagal memuat ulasan.</p>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg bg-slate-50">
        <p className="text-muted-foreground">Belum ada ulasan untuk destinasi ini. Jadilah yang pertama!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4 border-b pb-6">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Wisatawan</p> {/* Nanti diganti nama user asli */}
              <StarRating rating={review.rating} />
            </div>
            <p className="text-muted-foreground mt-2">{review.comment}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(review.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}