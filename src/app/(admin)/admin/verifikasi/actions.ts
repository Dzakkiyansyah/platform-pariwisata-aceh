'use server'

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getDocumentUrl(path: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from('dokumen-verifikasi').createSignedUrl(path, 60);
    if (error) return { error: "Gagal mendapatkan URL dokumen." };
    return { url: data.signedUrl };
}

export async function approvePengelola(profileId: string) {
    const supabase = createAdminClient();

    const { data: details, error: detailsError } = await supabase
        .from('pengelola_details')
        .select('nama_destinasi_diajukan, category_id')
        .eq('profile_id', profileId)
        .single();

    if (detailsError || !details) {
        return { error: "Gagal menemukan detail pendaftar." };
    }

    await supabase.from('pengelola_details').update({ status_verifikasi: 'approved' }).eq('profile_id', profileId);
    await supabase.from('profiles').update({ role: 'pengelola' }).eq('id', profileId);

    // Ambil nama destinasi
    const destinationName = details.nama_destinasi_diajukan;
    const slug = destinationName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
    // Buat entri destinasi baru 
    const { error: destinationError } = await supabase
        .from('destinations')
        .insert({
            name: destinationName,
            slug: slug,
            category_id: details.category_id,
            user_id: profileId,
            status: 'draft',
        });

    if (destinationError) {
        console.error("Destination Insert Error:", destinationError);
        // Jika gagal, kembalikan perubahan (rollback)
        await supabase.from('profiles').update({ role: 'pengelola_pending' }).eq('id', profileId);
        await supabase.from('pengelola_details').update({ status_verifikasi: 'pending' }).eq('profile_id', profileId);
        return { error: "Gagal membuat entri destinasi baru. Cek log server." };
    }
    
    revalidatePath('/admin/verifikasi');
    return { message: "Pendaftar berhasil disetujui dan destinasi telah dibuat." };
}

export async function rejectPengelola(profileId: string) {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(profileId);
    if (error) return { error: "Gagal menolak dan menghapus pendaftar." };
    revalidatePath('/admin/verifikasi');
    return { message: "Pendaftar berhasil ditolak dan dihapus." };
}