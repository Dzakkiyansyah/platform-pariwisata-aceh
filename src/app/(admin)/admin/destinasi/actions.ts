// src/app/(admin)/admin/destinasi/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Fungsi untuk update status destinasi
export async function updateDestinationStatus(
  destinationId: number,
  newStatus: 'published' | 'archived' | 'draft'
) {
  // ✅ Perbaikan: tambahkan 'await'
  const supabase = await createClient();

  // Lakukan update data di tabel 'destinations'
  const { error } = await supabase
    .from('destinations')
    .update({ status: newStatus })
    .eq('id', destinationId);

  if (error) {
    console.error("Error updating destination:", error);
    return { error: 'Gagal memperbarui status destinasi.' };
  }

  // Refresh halaman admin
  revalidatePath('/admin/destinasi');

  // Refresh halaman publik kalau statusnya 'published'
  if (newStatus === 'published') {
    revalidatePath('/destinasi');
    revalidatePath('/');
  }

  return { message: `Status destinasi berhasil diubah menjadi ${newStatus}.` };
}
