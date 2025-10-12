// src/app/(main)/login/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.user) {
        return { message: error?.message || "Email atau password salah." };
    }

    const { data: role, error: rpcError } = await supabase
        .rpc('get_user_role', { user_id: data.user.id });

    if (rpcError) {
        return { message: "Gagal mendapatkan data peran pengguna." };
    }

    if (role === 'admin') {
    redirect('/admin/dashboard');
}        else if (role === 'pengelola') {
    redirect('/pengelola/dashboard');
        } else {
    redirect('/');
}

}