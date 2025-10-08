// src/app/(admin)/admin/destinasi/page.tsx

import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DestinationActions from "@/components/admin/DestinationActions";

export default async function ManajemenDestinasiPage() {
  const supabase = createClient();

  // Ambil data destinasi dan relasinya ke kategori serta profil pengelola
  const { data: destinations, error } = await supabase
    .from("destinations")
    .select(`
      id,
      name,
      status,
      categories ( name ),
      profiles ( full_name )
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching destinations:", error);
  }

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
              {destinations && destinations.length > 0 ? (
                destinations.map((dest: any) => (
                  <TableRow key={dest.id}>
                    <TableCell className="font-medium">{dest.name}</TableCell>
                    <TableCell>{dest.categories?.name || "N/A"}</TableCell>
                    <TableCell>
                      {dest.profiles?.full_name || "Dinas Pariwisata"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          dest.status === "published" ? "default" : "secondary"
                        }
                      >
                        {dest.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* TODO: Buat tombol aksi fungsional */}
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      {/* Atau ganti dengan komponen DestinationActions */}
                      {/* <DestinationActions id={dest.id} /> */}
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
