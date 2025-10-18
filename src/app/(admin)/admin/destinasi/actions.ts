'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// untuk update status destinasi
export async function updateDestinationStatus(
  destinationId: number,
  newStatus: 'published' | 'archived' | 'draft'
) {
  const supabase = await createClient();

  // Perbarui status destinasi di database
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
  if (newStatus === 'published') {
    revalidatePath('/destinasi');
    revalidatePath('/');
  }

  return { message: `Status destinasi berhasil diubah menjadi ${newStatus}.` };
}
