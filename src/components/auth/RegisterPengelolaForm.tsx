'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Category = { id: number; name: string; };

export default function RegisterPengelolaForm() {
    // ... (semua state tidak berubah)
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [destinationName, setDestinationName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('id, name');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!documentFile) {
            toast.error("Harap unggah dokumen pendukung.");
            return;
        }
        setIsLoading(true);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, role: 'pengelola_pending' } }
        });

        if (authError || !authData.user) {
            toast.error(authError?.message || "Gagal mendaftarkan akun.");
            setIsLoading(false);
            return;
        }

        const user = authData.user;
        const filePath = `${user.id}/${documentFile.name}`;
        // --------------------------------

        const { error: storageError } = await supabase.storage
            .from('dokumen-verifikasi')
            .upload(filePath, documentFile);
        
        if (storageError) {
            toast.error("Gagal mengunggah dokumen.");
            console.error("Storage Error:", storageError);
            setIsLoading(false);
            return;
        }

        const { error: detailsError } = await supabase.from('pengelola_details').insert({
            profile_id: user.id,
            nama_usaha: businessName,
            nama_destinasi_diajukan: destinationName,
            category_id: parseInt(categoryId),
            dokumen_pendukung_path: filePath, 
            status_verifikasi: 'pending',
        });

        if (detailsError) {
            toast.error("Gagal menyimpan data usaha.");
            console.error("Details Error:", detailsError);
            setIsLoading(false);
            return;
        }
        
        toast.success("Pendaftaran berhasil! Akun Anda sedang ditinjau.");
        router.push('/register/pengelola/menunggu-verifikasi');
        setIsLoading(false);
    };
    
    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">Pendaftaran Pengelola Destinasi</CardTitle>
                <CardDescription>Lengkapi data di bawah untuk mendaftarkan destinasi Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp} className="space-y-8">
                    <fieldset className="space-y-4">
                        <legend className="font-semibold text-lg mb-2">Data Diri</legend>
                        <div className="grid gap-2"><label>Nama Lengkap</label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
                        <div className="grid gap-2"><label>Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                        <div className="grid gap-2"><label>No. Handphone</label><Input value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
                        <div className="grid gap-2"><label>Password</label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                    </fieldset>
                    <fieldset className="space-y-4">
                        <legend className="font-semibold text-lg mb-2">Data Usaha</legend>
                        <div className="grid gap-2"><label>Nama Usaha/Lembaga</label><Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required /></div>
                        <div className="grid gap-2"><label>Nama Destinasi yang Diajukan</label><Input value={destinationName} onChange={(e) => setDestinationName(e.target.value)} required /></div>
                        <div className="grid gap-2">
                            <label>Kategori Destinasi</label>
                            <Select required onValueChange={setCategoryId}><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><label>Dokumen Pendukung (PDF)</label><Input type="file" accept=".pdf" onChange={handleFileChange} required /></div>
                    </fieldset>
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Memproses..." : "Daftar & Ajukan Verifikasi"}</Button>
                </form>
            </CardContent>
        </Card>
    );
}