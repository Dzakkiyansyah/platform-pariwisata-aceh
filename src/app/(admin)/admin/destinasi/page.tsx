import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DestinationActions from "@/components/admin/DestinationActions";

// --- PERBAIKAN 1: Perbarui Tipe Data ---
// 'profiles' sekarang berisi relasi ke 'pengelola_details'
type DestinationWithRelations = {
    id: number;
    name: string;
    slug: string; // Tambahkan slug untuk dikirim ke DestinationActions
    status: string;
    categories: {
        name: string;
    } | null;
    profiles: {
        pengelola_details: {
            nama_usaha: string;
        }[] | null; // Supabase mengembalikan relasi one-to-one sebagai array
    } | null;
};

export default async function ManajemenDestinasiPage() {
    const supabase = await createClient(); 

    // --- PERBAIKAN 2: Perbarui Query Select ---
    // Lakukan nested join dari profiles ke pengelola_details
    const { data, error } = await supabase
        .from('destinations')
        .select(`
            id, name, slug, status,
            categories ( name ),
            profiles ( pengelola_details ( nama_usaha ) )
        `)
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching destinations:", error);
        return <div className="p-8">Terjadi kesalahan saat memuat data destinasi.</div>;
    }

    const destinations: DestinationWithRelations[] = data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Management Destinasi</h1>
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
                                destinations.map((dest) => (
                                    <TableRow key={dest.id}>
                                        <TableCell className="font-medium">{dest.name}</TableCell>
                                        <TableCell>{dest.categories?.name || 'N/A'}</TableCell>
                                        
                                        {/* --- PERBAIKAN 3: Tampilkan Nama Usaha --- */}
                                        <TableCell>
                                            {dest.profiles?.pengelola_details?.[0]?.nama_usaha || 'Dinas Pariwisata'}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant={dest.status === 'published' ? 'default' : 'secondary'}>
                                                {dest.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
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