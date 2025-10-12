// src/app/(admin)/admin/destinasi/page.tsx

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DestinationActions from "@/components/admin/DestinationActions";

// 1. Definisikan tipe (label) yang sesuai dengan data dari Supabase
type DestinationWithRelations = {
    id: number;
    name: string;
    status: string;
    categories: {
        name: string;
    } | null; // Bisa jadi null jika destinasi belum punya kategori
    profiles: {
        full_name: string | null;
    } | null; // Bisa jadi null jika destinasi dibuat oleh admin (bukan pengelola)
};



export default async function ManajemenDestinasiPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('destinations')
        .select(`
            id,
            name,
            status,
            categories ( name ),
            profiles ( full_name )
        `)
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching destinations:", error);
        return <div className="p-8">Terjadi kesalahan saat memuat data destinasi.</div>;
    }

    // 2. Terapkan tipe pada variabel kita
    const destinations: DestinationWithRelations[] = data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manajemen Destinasi</h1>
                <p className="text-muted-foreground mt-1">
                    Awasi dan kelola semua destinasi yang terdaftar di platform.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Semua Destinasi</CardTitle>
                    <CardDescription>
                        Berikut adalah daftar semua destinasi yang ada di database.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Destinasi</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Pengelola</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {destinations.length > 0 ? (
                                // 3. Hapus ': any'. TypeScript sekarang sudah tahu tipe 'dest'
                                destinations.map((dest) => (
                                    <TableRow key={dest.id}>
                                        <TableCell className="font-medium">{dest.name}</TableCell>
                                        <TableCell>{dest.categories?.name || 'N/A'}</TableCell>
                                        <TableCell>{dest.profiles?.full_name || 'Dinas Pariwisata'}</TableCell>
                                        <TableCell>
                                            <Badge variant={dest.status === 'published' ? 'default' : 'secondary'}>
                                                {dest.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* Kirim 'dest' yang sudah punya tipe jelas */}
                                            <DestinationActions destination={dest} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Belum ada destinasi yang terdaftar.
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