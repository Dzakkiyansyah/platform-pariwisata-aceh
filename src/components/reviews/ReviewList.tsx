import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

type ReviewFromFunction = {
  id: number;
  comment: string | null;
  rating: number;
  created_at: string;
  full_name: string | null;
  avatar_url: string | null;
  anonymous_name: string | null;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

type ReviewListProps = {
  destinationId: number;
}

export default async function ReviewList({ destinationId }: ReviewListProps) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc('get_reviews_for_destination', { dest_id: destinationId });
  // -------------------------

  if (error) {
    console.error("ReviewList RPC Error:", error);
    return <p className="text-red-500">Gagal memuat ulasan.</p>;
  }

  const reviews: ReviewFromFunction[] = data || [];

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
        <div key={review.id} className="flex gap-4 border-b pb-6 last:border-b-0">
          <Avatar>
            <AvatarImage src={review.avatar_url || undefined} />
            <AvatarFallback>{(review.full_name || review.anonymous_name)?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{review.full_name || review.anonymous_name || 'Wisatawan'}</p>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-muted-foreground mt-2 text-sm">{review.comment}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(review.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}