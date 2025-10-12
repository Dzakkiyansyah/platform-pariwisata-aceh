// src/app/(admin)/admin/verifikasi/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Fungsi untuk membuat URL aman untuk melihat dokumen
export async function getDocumentUrl(path: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
        .from('dokumen-verifikasi')
        .createSignedUrl(path, 60);

    if (error) return { error: "Gagal mendapatkan URL dokumen." };
    
    return { url: data.signedUrl };
    // -------------------------
}

// approve pendaftar
export async function approvePengelola(profileId: string) {
    const supabase = await createClient();
    
    const { error: detailsError } = await supabase
        .from('pengelola_details')
        .update({ status_verifikasi: 'approved' })
        .eq('profile_id', profileId);

    if (detailsError) return { error: "Gagal menyetujui detail pengelola." };

    const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'pengelola' })
        .eq('id', profileId);

    if (profileError) return { error: "Gagal mengubah peran profil." };

    revalidatePath('/admin/verifikasi');
    return { message: "Pendaftar berhasil disetujui." };
}

// Reject pendaftar
export async function rejectPengelola(profileId: string) {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin.auth.admin.deleteUser(profileId);

    if (error) {
        console.error("Delete user error:", error);
        return { error: "Gagal menolak dan menghapus pendaftar." };
    }
    
    revalidatePath('/admin/verifikasi');
    return { message: "Pendaftar berhasil ditolak dan dihapus." };
}