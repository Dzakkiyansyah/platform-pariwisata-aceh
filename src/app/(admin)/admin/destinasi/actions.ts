'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateDestinationStatus(destinationId: number, newStatus: 'published' | 'archived' | 'draft') {
    // ... (fungsi ini tidak berubah)
    const supabase = await createClient();
    const { error } = await supabase
        .from('destinations')
        .update({ status: newStatus })
        .eq('id', destinationId);

    if (error) {
        return { error: 'Gagal memperbarui status destinasi.' };
    }
    revalidatePath('/admin/destinasi');
    revalidatePath('/destinasi');
    revalidatePath('/');
    return { message: `Status destinasi berhasil diubah menjadi ${newStatus}.` };
}

// --- FUNGSI BARU UNTUK MENGHAPUS DESTINASI ---
export async function deleteDestination(destinationId: number) {
    // Gunakan Klien Admin untuk izin penuh
    const supabase = createAdminClient();

    // 1. Ambil semua path gambar terkait destinasi ini
    const { data: destinationData, error: fetchError } = await supabase
        .from('destinations')
        .select('image_url, destination_photos(photo_path)')
        .eq('id', destinationId)
        .single();
    
    if (fetchError) {
        return { error: 'Gagal menemukan data destinasi untuk dihapus.' };
    }

    // 2. Hapus data dari tabel 'destinations'
    // Ini akan otomatis menghapus baris terkait di 'reviews', 'bookmarks', dan 'destination_photos'
    // karena kita sudah mengatur ON DELETE CASCADE di database.
    const { error: deleteError } = await supabase
        .from('destinations')
        .delete()
        .eq('id', destinationId);

    if (deleteError) {
        return { error: 'Gagal menghapus destinasi dari database.' };
    }

    // 3. Hapus semua file gambar dari Storage
    const filesToDelete: string[] = [];
    // Tambahkan gambar utama jika ada
    if (destinationData.image_url) {
        const mainImageFile = destinationData.image_url.split('/gambar-destinasi/')[1];
        if (mainImageFile) filesToDelete.push(mainImageFile);
    }
    // Tambahkan semua gambar galeri
    destinationData.destination_photos.forEach((photo: { photo_path: string }) => {
        const galleryFile = photo.photo_path.split('/gambar-destinasi/')[1];
        if (galleryFile) filesToDelete.push(galleryFile);
    });

    if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
            .from('gambar-destinasi')
            .remove(filesToDelete);
        
        if (storageError) {
            console.error("Storage Delete Error:", storageError);
        }
    }

    revalidatePath('/admin/destinasi');
    revalidatePath('/');
    revalidatePath('/destinasi');
    return { message: 'Destinasi berhasil dihapus.' };
}