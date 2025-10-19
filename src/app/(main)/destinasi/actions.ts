'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(destinationId: number, isBookmarked: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Anda harus login untuk menyimpan destinasi." };
    }

    if (isBookmarked) {
        // Jika sudah di-bookmark, hapus
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('user_id', user.id)
            .eq('destination_id', destinationId);
        
        if (error) return { error: "Gagal menghapus bookmark." };

    } else {
        // Jika belum, tambahkan
        const { error } = await supabase
            .from('bookmarks')
            .insert({ user_id: user.id, destination_id: destinationId });

        if (error) return { error: "Gagal menambahkan bookmark." };
    }

    // Refresh halaman detail dan halaman profil agar datanya terupdate
    revalidatePath('/destinasi/[slug]', 'layout');
    revalidatePath('/profil');

    return { message: isBookmarked ? "Bookmark dihapus." : "Destinasi berhasil disimpan." };
}