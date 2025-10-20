import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, MapPin, Newspaper } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import RecentActivitiesFeed from "@/components/admin/RecentActivitiesFeed";
import AnalyticsChart from "@/components/admin/AnalyticsChart";

// Tipe data ulasan dengan profil pengguna
type ReviewWithProfile = {
    id: number;
    comment: string | null;
    profiles: {
    full_name: string | null;
    avatar_url: string | null;
    } | null;
    anonymous_name: string | null;
};

export default async function DashboardPage() {
  const supabase = createAdminClient();

  // Hitung batas waktu 24 jam terakhir
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Query paralel untuk statistik utama
const [
    destinationsResult,
    usersResult,
    newsResult,
    recentReviewsResult,
    recentActivitiesResult,
] = await Promise.all([
    supabase.from("destinations").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .gte("created_at", twentyFourHoursAgo),
    supabase
        .from("reviews")
        .select(`*, profiles(full_name, avatar_url)`)
        .order("created_at", { ascending: false })
        .limit(5),
]);

  // Ambil hasil dengan fallback aman
const totalDestinasi = destinationsResult.count ?? 0;
const totalPengguna = usersResult.count ?? 0;
const totalBerita = newsResult.count ?? 0;
const ulasanBaru = recentReviewsResult.count ?? 0;
const recentActivities: ReviewWithProfile[] = recentActivitiesResult.data || [];

return (
    <div className="space-y-8">
      {/* Header Dashboard */}
    <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="mt-1 text-muted-foreground">
            Ringkasan data pariwisata Kota Banda Aceh secara real-time.
        </p>
    </div>

      {/* Kartu Statistik Utama */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Destinasi</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{totalDestinasi}</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{totalPengguna}</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{totalBerita}</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ulasan Baru (24 Jam)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">+{ulasanBaru}</div>
            </CardContent>
        </Card>
    </div>

      {/* Grafik & Aktivitas Terbaru */}
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        {/* Kartu Chart */}
        <Card className="lg:col-span-4">
            <CardHeader>
            <CardTitle>Statistik Analitik</CardTitle>
            </CardHeader>
            <CardContent>
            <AnalyticsChart />
            </CardContent>
        </Card>

        {/* Kartu Aktivitas Terbaru */}
        <Card className="lg:col-span-3">
            <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
            <RecentActivitiesFeed />
        </CardContent>
        </Card>
    </div>
    </div>
);
}
