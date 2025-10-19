'use server'

import { createClient } from "@/lib/supabase/server";
import { type ActionState } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Anda tidak terautentikasi." };

    const fullName = formData.get('fullName') as string;
    const photoFile = formData.get('photo') as File;

    let avatarUrl = formData.get('currentAvatarUrl') as string;

    // Proses upload foto jika ada file baru yang dipilih
    if (photoFile && photoFile.size > 0) {
        const filePath = `${user.id}/avatar.png`;
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, photoFile, { upsert: true }); 
        
        if (uploadError) {
            console.error("Avatar Upload Error:", uploadError);
            return { error: 'Gagal mengunggah foto profil.' };
        }

        // Dapatkan URL publik yang baru dengan "cache buster"
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
    }

    // Update data di tabel profiles
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq('id', user.id);
    
    if (updateError) {
        console.error("Profile Update Error:", updateError);
        return { error: 'Gagal memperbarui profil.' };
    }

    revalidatePath('/profil');
    revalidatePath('/'); 
    return { message: "Profil berhasil diperbarui." };
}