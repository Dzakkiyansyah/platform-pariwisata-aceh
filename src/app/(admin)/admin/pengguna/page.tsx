import { createAdminClient } from "@/lib/supabase/admin"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import UserActions from "@/components/admin/UserActions";

type UserProfile = {
    id: string;
    full_name: string | null;
    email: string | undefined;
    role: string | null;
};

export default async function ManajemenPenggunaPage() {
    const supabase = createAdminClient(); 

    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');

    if (authError || profilesError) {
        console.error("Error fetching users:", authError || profilesError);
        return <div>Gagal memuat data pengguna.</div>;
    }

    const combinedUsers: UserProfile[] = authUsers.map(authUser => {
        const profile = profiles.find(p => p.id === authUser.id);
        return {
            id: authUser.id,
            full_name: profile?.full_name || 'N/A',
            email: authUser.email,
            role: profile?.role || 'N/A'
        };
    });

    const wisatawan = combinedUsers.filter(user => user.role === 'wisatawan');
    const pengelola = combinedUsers.filter(user => user.role?.startsWith('pengelola'));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Management Pengguna</h1>
                <p className="text-muted-foreground mt-1">
                    Lihat dan kelola semua akun yang terdaftar di platform.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pengguna</CardTitle>
                    <CardDescription>
                        Pilih tab untuk melihat daftar pengguna berdasarkan peran mereka.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="wisatawan">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="wisatawan">Wisatawan</TabsTrigger>
                            <TabsTrigger value="pengelola">Pengelola</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="wisatawan">
                            <UserTable users={wisatawan} />
                        </TabsContent>

                        <TabsContent value="pengelola">
                            <UserTable users={pengelola} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

function UserTable({ users }: { users: UserProfile[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="font-medium">{user.full_name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'pengelola' || user.role === 'admin' ? 'default' : 'secondary'}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <UserActions user={user} />
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                            Tidak ada pengguna dalam kategori ini.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}