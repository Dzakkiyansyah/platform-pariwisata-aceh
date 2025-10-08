// src/app/(admin)/admin/berita/tambah/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addNews } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Tombol Submit dengan status pending
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Mempublikasikan..." : "Publikasikan Berita"}
        </Button>
    )
}

export default function TambahBeritaPage() {
    // Gunakan useFormState untuk menangani response dari server action
    const [state, formAction] = useFormState(addNews, null);

    // Tampilkan notifikasi jika ada error
    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/berita"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Tambah Berita Baru</h1>
                    <p className="text-muted-foreground mt-1">
                        Isi form di bawah untuk mempublikasikan artikel baru.
                    </p>
                </div>
            </div>

            <form action={formAction}>
                <Card>
                    <CardHeader>
                        <CardTitle>Konten Artikel</CardTitle>
                        <CardDescription>Pastikan semua informasi sudah benar sebelum dipublikasikan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="title">Judul Berita</label>
                            <Input id="title" name="title" required />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="image">Gambar Utama</label>
                            <Input id="image" name="image" type="file" accept="image/*" required />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="content">Isi Konten</label>
                            <Textarea id="content" name="content" rows={10} required />
                        </div>
                        <div className="flex justify-end">
                            <SubmitButton />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}