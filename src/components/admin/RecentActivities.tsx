import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Tipe untuk data ulasan yang diterima
type ReviewWithProfile = {
  id: number;
  comment: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  anonymous_name: string | null;
};

export default function RecentActivities({ reviews }: { reviews: ReviewWithProfile[] | null }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-10">Belum ada aktivitas terbaru.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={review.profiles?.avatar_url || ''} alt="Avatar" />
            <AvatarFallback>{(review.profiles?.full_name || review.anonymous_name)?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              Ulasan baru dari <span className="font-bold">{review.profiles?.full_name || review.anonymous_name || 'Wisatawan'}</span>
            </p>
            <p className="text-sm text-muted-foreground truncate">
              &quor;{review.comment}&quot;
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}