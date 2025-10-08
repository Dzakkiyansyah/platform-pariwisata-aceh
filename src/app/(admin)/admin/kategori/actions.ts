// src/app/(admin)/admin/kategori/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
    const supabase = createClient();
    
    // Ambil nama kategori dari form
    const name = formData.get('name') as string;

    // Buat slug otomatis dari nama (contoh: "Wisata Alam" -> "wisata-alam")
    const slug = name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');

    if (!name || !slug) {
        return { error: 'Nama kategori tidak boleh kosong.' };
    }

    // Masukkan data baru ke tabel 'categories'
    const { error } = await supabase
        .from('categories')
        .insert([{ name, slug }]);
    
    if (error) {
        console.error('Supabase error:', error);
        return { error: 'Gagal menambahkan kategori. Mungkin nama atau slug sudah ada.' };
    }

    // Revalidasi path agar data di halaman otomatis ter-update
    revalidatePath('/admin/kategori');
    revalidatePath('/register/pengelola'); // Juga revalidasi halaman pendaftaran
    revalidatePath('/destinasi'); // Juga revalidasi halaman destinasi

    return { message: 'Kategori berhasil ditambahkan.' };
}