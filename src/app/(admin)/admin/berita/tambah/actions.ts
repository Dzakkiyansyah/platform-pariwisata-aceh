// src/app/(admin)/admin/berita/tambah/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addNews(formData: FormData) {
    const supabase = createClient();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File;

    if (!title || !content || !imageFile) {
        return { error: 'Semua field wajib diisi.' };
    }

    // Buat slug otomatis
    const slug = title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    // Buat nama file yang unik untuk menghindari konflik
    const fileName = `${Date.now()}-${imageFile.name}`;
    const filePath = `public/${fileName}`;

    // 1. Upload gambar ke Storage
    const { error: uploadError } = await supabase.storage
        .from('gambar-berita')
        .upload(filePath, imageFile);

    if (uploadError) {
        console.error('Storage Error:', uploadError);
        return { error: 'Gagal mengunggah gambar.' };
    }

    // 2. Dapatkan URL publik dari gambar yang di-upload
    const { data: { publicUrl } } = supabase.storage
        .from('gambar-berita')
        .getPublicUrl(filePath);

    // 3. Simpan data berita ke database
    const { error: insertError } = await supabase.from('news').insert({
        title,
        slug,
        content,
        image_path: publicUrl, // Simpan URL publiknya
    });

    if (insertError) {
        console.error('Insert Error:', insertError);
        return { error: 'Gagal menyimpan berita ke database.' };
    }

    // Revalidasi halaman daftar berita agar data baru muncul
    revalidatePath('/admin/berita');
    revalidatePath('/'); // Revalidasi landing page juga

    // Redirect kembali ke halaman daftar berita setelah berhasil
    redirect('/admin/berita');
}