'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || 'Email atau password salah.');
    } else {
      toast.success('Login berhasil!');
      router.push('/');
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-[15px] shadow-sm border border-gray-100">
          {/* Back to Home Button */}
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#265DE2] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1C2C4A]">
              Selamat Datang Kembali!
            </h1>
            <p className="text-gray-600">
              Masuk untuk melanjutkan petualangan wisatamu di Banda Aceh
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[#265DE2] focus:border-[#265DE2] placeholder-gray-400 transition-colors"
                placeholder="nama@email.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-[#265DE2] hover:text-[#1C2C4A] transition-colors"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[#265DE2] focus:border-[#265DE2] placeholder-gray-400 transition-colors pr-12"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
<Button
  type="submit"
  disabled={isLoading}
  className={`w-full rounded-[10px] font-medium transition-all duration-300 ${
    isLoading ? 'cursor-not-allowed opacity-70' : ''
  }`}
>
  {isLoading ? (
    <span className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      Memproses...
    </span>
  ) : (
    'Masuk ke Akun'
  )}
</Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <Link 
                href="/register" 
                className="text-[#265DE2] hover:text-[#1C2C4A] font-semibold transition-colors"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

{/* Right Panel - Image */}
<div className="hidden md:block w-1/2 relative">
  <div className="absolute inset-0 bg-[#1C2C4A]/20 z-10 rounded-l-[15px]" />

  <Image
    src="/images/hero-background.jpg"
    alt="Wisata Banda Aceh"
    fill
    priority
    className="object-cover rounded-l-[15px]"
  />

  {/* Overlay Text */}
  <div className="absolute bottom-8 left-8 right-8 text-white z-20">
    <h3 className="text-2xl font-bold mb-2">Jelajahi Keindahan Banda Aceh</h3>
    <p className="text-blue-100">
      Temukan pengalaman wisata yang tak terlupakan di Serambi Mekah
    </p>
  </div>
</div>

    </div>
  );
}