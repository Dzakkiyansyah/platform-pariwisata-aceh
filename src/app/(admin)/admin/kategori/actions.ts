'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
    const supabase = await createClient(); 
    
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');

    if (!name || !slug) {
        return { error: 'Nama kategori tidak boleh kosong.' };
    }

    const { error } = await supabase
        .from('categories')
        .insert([{ name, slug }]);
    
    if (error) {
        console.error('Supabase error:', error);
        return { error: 'Gagal menambahkan kategori. Mungkin nama atau slug sudah ada.' };
    }

    // Revalidasi semua path yang menggunakan data kategori
    revalidatePath('/admin/kategori');
    revalidatePath('/register/pengelola');
    revalidatePath('/destinasi');

    return { message: 'Kategori berhasil ditambahkan.' };
}