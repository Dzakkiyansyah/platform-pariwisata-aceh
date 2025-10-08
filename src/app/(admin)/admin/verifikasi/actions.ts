// src/app/(admin)/admin/verifikasi/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";

const supabase = createClient();

// Fungsi untuk membuat URL aman untuk melihat dokumen
export async function getDocumentUrl(path: string) {
    const { data, error } = await supabase.storage
        .from('dokumen-verifikasi')
        .createSignedUrl(path, 60); // URL berlaku selama 60 detik

    if (error) return { error: "Gagal mendapatkan URL dokumen." };
    return { url: data.url };
}

// Fungsi untuk MENYETUJUI pendaftar
export async function approvePengelola(profileId: string) {
    // 1. Ubah status di pengelola_details
    const { error: detailsError } = await supabase
        .from('pengelola_details')
        .update({ status_verifikasi: 'approved' })
        .eq('profile_id', profileId);

    if (detailsError) return { error: "Gagal menyetujui detail pengelola." };

    // 2. Ubah peran di profiles
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'pengelola' })
        .eq('id', profileId);

    if (profileError) return { error: "Gagal mengubah peran profil." };

    // TODO: Kirim email notifikasi ke pengguna

    revalidatePath('/admin/verifikasi');
    return { message: "Pendaftar berhasil disetujui." };
}

// Fungsi untuk MENOLAK pendaftar
export async function rejectPengelola(profileId: string) {
    // Untuk MVP, kita akan hapus datanya agar bersih
    // NOTE: Ini membutuhkan koneksi Supabase Admin, yang harus diatur di server-side
    // Untuk sementara, kita akan hapus data dari tabel publik saja
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

    if (error) return { error: "Gagal menolak pendaftar." };
    
    // TODO: Kirim email notifikasi ke pengguna
    
    revalidatePath('/admin/verifikasi');
    return { message: "Pendaftar berhasil ditolak." };
}