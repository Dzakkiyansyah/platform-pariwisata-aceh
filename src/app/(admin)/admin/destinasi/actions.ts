// src/app/(admin)/admin/destinasi/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";

export async function updateDestinationStatus(destinationId: number, newStatus: 'published' | 'archived' | 'draft') {
    const supabase = createClient();

    const { error } = await supabase
        .from('destinations')
        .update({ status: newStatus })
        .eq('id', destinationId);

    if (error) {
        return { error: 'Gagal memperbarui status destinasi.' };
    }

    // Refresh data di halaman manajemen destinasi
    revalidatePath('/admin/destinasi');
    // Refresh juga halaman publik jika statusnya diubah ke 'published'
    revalidatePath('/destinasi');
    revalidatePath('/');


    return { message: `Status destinasi berhasil diubah menjadi ${newStatus}.` };
}