// src/app/(admin)/admin/pengguna/actions.ts
'use server'

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
    // Kita harus menggunakan admin client untuk aksi ini
    const supabase = createAdminClient();

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
        console.error("Delete user error:", error);
        return { error: 'Gagal menghapus pengguna.' };
    }

    // Refresh data di halaman manajemen pengguna
    revalidatePath('/admin/pengguna');
    return { message: 'Pengguna berhasil dihapus.' };
}