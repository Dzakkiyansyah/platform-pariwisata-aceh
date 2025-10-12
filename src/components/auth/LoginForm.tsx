'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            toast.error(error?.message || "Email atau password salah.");
            setIsLoading(false);
            return;
        }

        const { data: roleData, error: rpcError } = await supabase
            .rpc('get_user_role', { user_id: data.user.id });

        if (rpcError) {
            console.error("Supabase RPC Error:", rpcError);
            toast.error("Gagal mendapatkan data peran pengguna. Silakan coba lagi.");
            setIsLoading(false);
            await supabase.auth.signOut();
            return;
        }

        toast.success("Login berhasil!");

        const role = roleData ? String(roleData).trim() : null;

        // --- LOGIKA PENGALIHAN BERDASARKAN 3 PERAN ---
        if (role === 'admin') {
            router.push('/admin/dashboard');
        } else if (role === 'pengelola') {
            router.push('/pengelola/dashboard');
        } else {
            router.push('/');
        }
        
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="flex w-full max-w-4xl rounded-xl overflow-hidden shadow-lg bg-white">
                {/* Sisi Kiri - Form */}
                <div className="w-full md:w-1/2 p-8 space-y-6 flex flex-col justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 p-0 h-auto font-medium self-start"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Beranda
                    </Button>

                    <div>
                        <h1 className="text-3xl font-bold text-blue-600 mb-1">Selamat Datang</h1>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Kembali!</h2>
                        <p className="text-gray-600 mb-8">
                            Masuk untuk melanjutkan petualangan wisatamu.
                        </p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <Input id="email" type="email" placeholder="Example@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Lupa password?</Link>
                            </div>
                            <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-semibold text-base rounded-lg transition-colors">
                            {isLoading ? "Memproses..." : "Login"}
                        </Button>
                    </form>
                    <div className="text-center mt-6 pt-4 border-t border-gray-200">
                        <p className="text-gray-600 text-sm">
                            Belum punya akun?{" "}
                            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">Daftar di sini</Link>
                        </p>
                    </div>
                </div>
                {/* Sisi Kanan - Gambar */}
                <div className="hidden md:block w-1/2 relative bg-gray-200">
                    <Image src="/images/hero-background.jpg" alt="Masjid Raya Baiturrahman" fill className="object-cover" priority />
                </div>
            </div>
        </div>
    );
}