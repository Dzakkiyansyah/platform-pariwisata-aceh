import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileDialog from "@/components/profil/EditProfileDialog";
import UserBookmarks from "@/components/profil/UserBookmarks";
import UserReviews from "@/components/profil/UserReviews";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Panggil fungsi database melalui RPC
  const { data: profile, error } = await supabase
    .rpc('get_user_profile_stats', { user_id_input: user.id })
    .single();
  // -------------------------

  if (error || !profile) {
    console.error("Error fetching profile via RPC:", error);
    return <div>Gagal memuat profil. Silakan coba lagi.</div>;
  }

  // Ekstrak jumlah dari hasil fungsi
  const bookmarkCount = profile.bookmark_count ?? 0;
  const reviewCount = profile.review_count ?? 0;

  return (
    <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto py-16">
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="bg-gray-50 p-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'User'} />
                <AvatarFallback className="text-3xl">{profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                <CardTitle className="text-3xl">{profile.full_name}</CardTitle>
                <CardDescription className="mt-1">{user.email}</CardDescription>
                </div>
                <EditProfileDialog userProfile={profile} />
            </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center my-6">
                    <div>
                        <p className="text-2xl font-bold">{bookmarkCount}</p>
                        <p className="text-sm text-muted-foreground">Destinasi Tersimpan</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{reviewCount}</p>
                        <p className="text-sm text-muted-foreground">Ulasan Ditulis</p>
                    </div>
                </div>

                <Tabs defaultValue="rencana" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="rencana">Rencana Perjalanan</TabsTrigger>
                    <TabsTrigger value="ulasan">Ulasan Saya</TabsTrigger>
                    </TabsList>
                    <TabsContent value="rencana" className="mt-4">
                        <UserBookmarks userId={user.id} />
                    </TabsContent>
                    <TabsContent value="ulasan" className="mt-4">
                        <UserReviews userId={user.id} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}