// src/app/(admin)/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⬇️ Tambahkan await di sini
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika tidak ada user yang login, tendang ke halaman login
  if (!user) {
    redirect("/login");
  }

  // Cek role (opsional nanti)
  // if (user.role !== 'admin') redirect('/');

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
