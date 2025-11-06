import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import NewsActions from "@/components/admin/NewsActions"; 

// Definisikan tipe untuk data berita
type News = {
    id: number;
    title: string;
    created_at: string;
    image_path: string | null;
};

export default async function BeritaPage() {
    const supabase = await createClient();

    // Ambil semua kolom yang dibutuhkan, termasuk image_path
    const { data, error } = await supabase
        .from('news')
        .select('id, title, created_at, image_path')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching news:", error);
    }

    const news: News[] = data || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Management Berita</h1>
                    <p className="text-muted-foreground mt-1">
                        Buat dan kelola semua berita dan acara untuk ditampilkan di halaman publik.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/berita/tambah">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Tambah Berita Baru
                    </Link>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Artikel Berita</CardTitle>
                    <CardDescription>
                        Berikut adalah semua artikel yang telah dibuat.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Judul Artikel</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tanggal Dibuat</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {news.length > 0 ? (
                                news.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell><Badge>Published</Badge></TableCell>
                                        <TableCell>{new Date(item.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</TableCell>
                                        <TableCell className="text-right">
                                            {/* Ganti placeholder dengan komponen aksi */}
                                            <NewsActions news={item} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Belum ada berita. Silakan buat satu.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
