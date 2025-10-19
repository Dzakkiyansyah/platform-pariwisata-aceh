import { createClient } from "@/lib/supabase/server";
import { Star } from "lucide-react";
import Link from "next/link";

type ReviewWithDestination = {
    id: number;
    comment: string | null;
    rating: number;
    created_at: string;
    destinations: {
        name: string;
        slug: string;
    } | null;
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">{Array.from({ length: 5 }, (_, i) => (<Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}</div>
);

export default async function UserReviews({ userId }: { userId: string }) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('reviews')
        .select('*, destinations(name, slug)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    
    if (error) return <p className="text-red-500">Gagal memuat riwayat ulasan.</p>;
    const reviews: ReviewWithDestination[] = data || [];

    if (reviews.length === 0) return <p className="text-muted-foreground text-center py-8">Anda belum memberikan ulasan apapun.</p>;

    return (
        <div className="space-y-4">
            {reviews.map(review => (
                <div key={review.id} className="border p-4 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                        <Link href={`/destinasi/${review.destinations?.slug}`} className="font-semibold hover:underline">{review.destinations?.name || 'Destinasi Dihapus'}</Link>
                        <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">&quot;{review.comment}&quot;</p>
                </div>
            ))}
        </div>
    );
}