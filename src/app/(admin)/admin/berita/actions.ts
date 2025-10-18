'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type ActionState } from "@/types/actions";

export async function addNews(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File;

    if (!title || !content || imageFile.size === 0) {
        return { error: 'Semua field wajib diisi.' };
    }

    const slug = title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const fileName = `${Date.now()}-${imageFile.name}`;
    const filePath = fileName;
    // ----------------------------

    // unggah gambar ke bucket
    const { error: uploadError } = await supabase.storage
        .from('gambar-berita')
        .upload(filePath, imageFile);

    if (uploadError) {
        console.error('Storage Error:', uploadError);
        return { error: 'Gagal mengunggah gambar.' };
    }

    const { data } = supabase.storage
        .from('gambar-berita')
        .getPublicUrl(filePath);
    
    const publicUrl = data.publicUrl;

    if (!publicUrl) {
        return { error: 'Gagal mendapatkan URL publik gambar.' };
    }

    const { error: insertError } = await supabase.from('news').insert({
        title,
        slug,
        content,
        image_path: publicUrl,
    });

    if (insertError) {
        console.error('Insert Error:', insertError);
        return { error: 'Gagal menyimpan berita ke database.' };
    }

    revalidatePath('/admin/berita');
    revalidatePath('/');
    
    redirect('/admin/berita');
}

export async function deleteNews(newsId: number, imagePath: string) {
    const supabase = await createClient();
    const { error: deleteError } = await supabase.from('news').delete().eq('id', newsId);
    if (deleteError) return { error: 'Gagal menghapus berita dari database.' };

    const fileName = imagePath.split('/').pop();
    if (fileName) {
        await supabase.storage.from('gambar-berita').remove([fileName]);
    }

    revalidatePath('/admin/berita');
    revalidatePath('/');
    return { message: 'Berita berhasil dihapus.' };
}