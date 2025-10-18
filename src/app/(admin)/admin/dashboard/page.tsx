import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, MapPin, Newspaper } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import RecentActivities from "@/components/admin/RecentActivities";

type ReviewWithProfile = {
    id: number;
    comment: string | null;
    profiles: {
    full_name: string | null;
    avatar_url: string | null;
    } | null;
};

export default async function DashboardPage() {
    const supabase = createAdminClient();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const destinationsCountPromise = supabase.from('destinations').select('*', { count: 'exact', head: true });
    const usersCountPromise = supabase.from('profiles').select('*', { count: 'exact', head: true });
    const newsCountPromise = supabase.from('news').select('*', { count: 'exact', head: true });
    const recentReviewsCountPromise = supabase.from('reviews').select('*', { count: 'exact', head: true }).gte('created_at', twentyFourHoursAgo);
    const recentActivitiesPromise = supabase.from('reviews').select(`*, profiles(full_name, avatar_url)`).order('created_at', { ascending: false }).limit(5);

    const [
        destinationsResult,
        usersResult,
        newsResult,
        recentReviewsResult,
        recentActivitiesResult
    ] = await Promise.all([
        destinationsCountPromise,
        usersCountPromise,
        newsCountPromise,
        recentReviewsCountPromise,
        recentActivitiesPromise
    ]);

    const totalDestinasi = destinationsResult.count ?? 0;
    const totalPengguna = usersResult.count ?? 0;
    const totalBerita = newsResult.count ?? 0;
    const ulasanBaru = recentReviewsResult.count ?? 0;
    
    const recentActivities: ReviewWithProfile[] = recentActivitiesResult.data || [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Ringkasan data pariwisata Kota Banda Aceh secara real-time.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/*  Card Statistik  */}
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Destinasi</CardTitle><MapPin className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalDestinasi}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Pengguna</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalPengguna}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Berita</CardTitle><Newspaper className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalBerita}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Ulasan Baru (24 Jam)</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">+{ulasanBaru}</div></CardContent></Card>
            </div>

            {/* Bagian Grafik dan Aktivitas Terbaru */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader><CardTitle>Grafik Pengunjung</CardTitle></CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center"><p className="text-muted-foreground">Fitur grafik akan dikembangkan selanjutnya.</p></CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader><CardTitle>Aktivitas Terbaru</CardTitle></CardHeader>
                    <CardContent className="h-[300px] overflow-y-auto">
                        <RecentActivities reviews={recentActivities} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}