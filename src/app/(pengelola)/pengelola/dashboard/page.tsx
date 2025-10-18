import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default async function PengelolaDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: destination, error: destError } = await supabase
        .from('destinations')
        .select('id, name')
        .eq('user_id', user.id)
        .single();
    
    if (!destination) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Destinasi Belum Dibuat</h1>
                <p className="text-muted-foreground mt-2">
                    Admin belum membuat entri destinasi untuk Anda. Silakan hubungi admin.
                </p>
            </div>
        );
    }

    const { count: totalUlasan } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('destination_id', destination.id);

    const { data: avgRatingData } = await supabase
        .rpc('get_average_rating', { dest_id: destination.id });

    const { data: latestReviews } = await supabase
        .from('reviews')
        .select('id, comment, rating, profiles(full_name, avatar_url)')
        .eq('destination_id', destination.id)
        .order('created_at', { ascending: false })
        .limit(5);

    const ratingRataRata = avgRatingData ? Number(avgRatingData).toFixed(1) : "0.0";

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard: {destination.name}</h1>
                <p className="text-muted-foreground mt-1">Ringkasan performa dan aktivitas terbaru.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{ratingRataRata}</div><p className="text-xs text-muted-foreground">dari {totalUlasan ?? 0} ulasan</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Ulasan</CardTitle><MessageSquare className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalUlasan ?? 0}</div></CardContent></Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader><CardTitle>Grafik Rating</CardTitle></CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center"><p className="text-muted-foreground">Grafik akan ditampilkan di sini</p></CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader><CardTitle>Ulasan Terbaru</CardTitle></CardHeader>
                    <CardContent className="h-[300px] space-y-4 overflow-y-auto">
                        {latestReviews && latestReviews.length > 0 ? (
                            latestReviews.map((review: any) => (
                                <div key={review.id} className="flex items-center">
                                    <Avatar className="h-9 w-9"><AvatarImage src={review.profiles?.avatar_url || ''} /><AvatarFallback>{review.profiles?.full_name?.charAt(0) || 'U'}</AvatarFallback></Avatar>
                                    <div className="ml-4 space-y-1"><p className="text-sm font-medium leading-none">{review.profiles?.full_name || 'Wisatawan'}</p><p className="text-sm text-muted-foreground truncate">"{review.comment}"</p></div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center pt-12">Belum ada ulasan untuk destinasi ini.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}