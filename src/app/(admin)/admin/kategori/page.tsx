// src/app/(admin)/admin/kategori/page.tsx

import { createClient } from "@/lib/supabase/server";
import AddCategoryForm from "@/components/admin/AddCategoryForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function KategoriPage() {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Management Kategori</h1>
                <p className="text-muted-foreground mt-1">
                    Tambah, lihat, atau hapus kategori wisata yang tersedia di platform.
                </p>
            </div>

            <AddCategoryForm />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Kategori</CardTitle>
                    <CardDescription>
                        Berikut adalah semua kategori yang telah ditambahkan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Nama Kategori</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories && categories.length > 0 ? (
                                categories.map(category => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.id}</TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                        <TableCell className="text-right">
                                            {/* TODO: Tambah tombol Edit & Hapus di sini */}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Belum ada kategori. Silakan tambahkan satu.
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
