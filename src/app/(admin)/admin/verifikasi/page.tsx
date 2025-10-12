// src/app/(admin)/admin/verifikasi/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import VerificationActions from "@/components/admin/VerificationActions";

// 1. Definisikan tipe (label) seperti sebelumnya. Ini sudah benar.
type Pendaftar = {
    id: number;
    profile_id: string;
    nama_usaha: string;
    dokumen_pendukung_path: string;
    created_at: string;
    full_name: string | null;
    email: string | null;
};

export default async function VerifikasiPage() {
    const supabase = await createClient();

    // 2. Lakukan panggilan RPC seperti biasa, TANPA <Pendaftar>
    const { data, error } = await supabase
        .rpc('get_pending_pengelola');

    if (error) {
        console.error("Error fetching pending users via RPC:", error);
    }
    
    // 3. Setelah data didapat, kita beritahu TypeScript bentuknya.
    // Ini akan menyelesaikan kedua error.
    const pendaftar: Pendaftar[] = data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Verifikasi Pendaftar Baru</h1>
                <p className="text-muted-foreground mt-1">
                    Tinjau dan kelola pendaftaran baru dari calon pengelola destinasi.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Menunggu Persetujuan</CardTitle>
                    <CardDescription>
                        Berikut adalah daftar pendaftar yang memerlukan verifikasi dari Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Pendaftar</TableHead>
                                <TableHead>Nama Usaha</TableHead>
                                <TableHead>Tanggal Daftar</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendaftar && pendaftar.length > 0 ? (
                                // Sekarang TypeScript tahu bahwa 'item' adalah Pendaftar
                                pendaftar.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="font-medium">{item.full_name}</div>
                                            <div className="text-sm text-muted-foreground">{item.email}</div>
                                        </TableCell>
                                        <TableCell>{item.nama_usaha}</TableCell>
                                        <TableCell>
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <VerificationActions 
                                                profileId={item.profile_id} 
                                                documentPath={item.dokumen_pendukung_path} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Tidak ada pendaftar baru saat ini.
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