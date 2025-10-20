'use server'

import { createClient } from "@/lib/supabase/server";
import { type ActionState } from "@/types/actions";
import { revalidatePath } from "next/cache";

// Fungsi untuk update informasi umum, termasuk gambar utama
export async function updateInfoUmum(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Anda tidak terautentikasi." };

    const destinationId = formData.get('destinationId') as string;
    const imageFile = formData.get('image_url') as File;
    let imageUrl = formData.get('current_image_url') as string;

    // Logika untuk upload gambar utama jika ada file baru
    if (imageFile && imageFile.size > 0) {
        const filePath = `${destinationId}/cover-${Date.now()}-${imageFile.name}`;
        
        const { error: uploadError } = await supabase.storage
            .from('gambar-destinasi')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error("Cover Image Upload Error:", uploadError);
            return { error: "Gagal mengunggah gambar utama." };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('gambar-destinasi').getPublicUrl(filePath);
        
        imageUrl = publicUrl;
    }

    const rawData = {
        name: formData.get('name') as string,
        category_id: Number(formData.get('category_id')),
        address: formData.get('address') as string,
        open_time: formData.get('open_time') as string,
        ticket_price: (formData.get('ticket_price') as string) || 'Gratis',
        website: formData.get('website') as string,
        image_url: imageUrl, // Simpan URL gambar yang baru atau yang lama
    };

    const { error } = await supabase
        .from('destinations')
        .update(rawData)
        .eq('user_id', user.id);

    if (error) {
        console.error("Update Error:", error);
        return { error: "Gagal memperbarui informasi umum." };
    }

    // --- PERBAIKAN DI SINI ---
    // Revalidasi semua halaman yang menampilkan gambar ini
    revalidatePath('/pengelola/destinasi'); // Halaman dasbor pengelola
    revalidatePath('/'); // Halaman utama (landing page)
    revalidatePath('/destinasi'); // Halaman daftar semua destinasi
    
    // Juga revalidasi halaman detailnya secara spesifik jika perlu
    const { data: slugData } = await supabase.from('destinations').select('slug').eq('id', destinationId).single();
    if (slugData?.slug) {
        revalidatePath(`/destinasi/${slugData.slug}`);
    }
    // -------------------------

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
    };

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
    };

    const { error } = await supabase.from('destinations').update(rawData).eq('user_id', user.id);

    if (error) { return { error: "Gagal memperbarui lokasi peta." }; }
    
    revalidatePath('/pengelola/destinasi');
    return { message: "Lokasi peta berhasil diperbarui." };
}

// Fungsi untuk mengunggah foto galeri
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

// Fungsi untuk menghapus foto galeri
export async function deletePhoto(photoId: number, photoPath: string) {
    const supabase = await createClient();
    
    await supabase.from('destination_photos').delete().eq('id', photoId);

    const filePath = photoPath.split('/gambar-destinasi/')[1];
    await supabase.storage.from('gambar-destinasi').remove([filePath]);

    revalidatePath('/pengelola/destinasi');
}