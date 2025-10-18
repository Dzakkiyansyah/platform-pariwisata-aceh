import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PengelolaSidebar from "@/components/pengelola/PengelolaSidebar";

export default async function PengelolaLayout({ children }: { children: React.ReactNode; }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { redirect('/login'); }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, pengelola_details ( nama_usaha )')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'pengelola' && profile?.role !== 'admin') {
    redirect('/');
  }

  const namaUsaha = profile?.pengelola_details?.[0]?.nama_usaha || "Dasbor Anda";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <PengelolaSidebar namaUsaha={namaUsaha} />
      <main className="flex-1 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}