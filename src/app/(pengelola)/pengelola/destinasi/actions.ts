'use server'

import { createClient } from "@/lib/supabase/server";
import { type ActionState } from "@/types/actions";
import { revalidatePath } from "next/cache";

// Fungsi untuk update informasi umum
export async function updateInfoUmum(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Anda tidak terautentikasi." };

    const rawData = {
        name: formData.get('name') as string,
        category_id: Number(formData.get('category_id')),
        address: formData.get('address') as string,
        open_time: formData.get('open_time') as string,
        ticket_price: (formData.get('ticket_price') as string) || 'Gratis',
        website: formData.get('website') as string,
    }

    const { error } = await supabase.from('destinations').update(rawData).eq('user_id', user.id);

    if (error) {
        console.error("Update Error:", error);
        return { error: "Gagal memperbarui informasi umum." };
    }

    revalidatePath('/pengelola/destinasi');
    return { message: "Informasi umum berhasil diperbarui." };
}

// Fungsi untuk update deskripsi & fasilitas
export async function updateDeskripsi(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Anda tidak terautentikasi." };

    const rawData = {
        description: formData.get('description') as string,
        facilities: (formData.get('facilities') as string).split(',').map(f => f.trim()),
    }

    const { error } = await supabase.from('destinations').update(rawData).eq('user_id', user.id);

    if (error) { return { error: "Gagal memperbarui deskripsi & fasilitas." }; }
    
    revalidatePath('/pengelola/destinasi');
    return { message: "Deskripsi & fasilitas berhasil diperbarui." };
}

// Fungsi untuk update lokasi peta
export async function updateLokasi(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Anda tidak terautentikasi." };

    const rawData = {
        lat: Number(formData.get('lat')),
        lng: Number(formData.get('lng')),
    }

    const { error } = await supabase.from('destinations').update(rawData).eq('user_id', user.id);

    if (error) { return { error: "Gagal memperbarui lokasi peta." }; }
    
    revalidatePath('/pengelola/destinasi');
    return { message: "Lokasi peta berhasil diperbarui." };
}

// Fungsi untuk mengunggah foto baru
export async function uploadPhotos(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Anda tidak terautentikasi." };

    const destinationId = formData.get('destinationId') as string;
    const files = formData.getAll('photos') as File[];

    if (files.length === 0 || files[0].size === 0) {
        return { error: "Pilih setidaknya satu file untuk diunggah." };
    }

    for (const file of files) {
        // Path file: 'ID_DESTINASI/timestamp-namafile.jpg'
        const filePath = `${destinationId}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from('gambar-destinasi').upload(filePath, file);

        if (uploadError) {
            console.error("Upload Error:", uploadError);
            return { error: `Gagal mengunggah ${file.name}. Periksa RLS Storage.` };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('gambar-destinasi').getPublicUrl(filePath);
        
        await supabase.from('destination_photos').insert({
            destination_id: Number(destinationId),
            photo_path: publicUrl
        });
    }

    revalidatePath('/pengelola/destinasi');
    return { message: `${files.length} foto berhasil diunggah.` };
}

// FUNGSI BARU UNTUK MENGHAPUS FOTO
export async function deletePhoto(photoId: number, photoPath: string) {
    const supabase = await createClient();
    
    // 1. Hapus dari database
    await supabase.from('destination_photos').delete().eq('id', photoId);

    // 2. Hapus dari storage
    const filePath = photoPath.split('/gambar-destinasi/')[1];
    await supabase.storage.from('gambar-destinasi').remove([filePath]);

    revalidatePath('/pengelola/destinasi');
}