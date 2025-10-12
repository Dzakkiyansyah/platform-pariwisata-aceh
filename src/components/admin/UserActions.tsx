// src/components/admin/UserActions.tsx
'use client'

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteUser } from "@/app/(admin)/admin/pengguna/actions";
import { toast } from "sonner";
import { useTransition } from "react";

// Tipe data untuk user yang diterima
type User = {
    id: string;
    full_name: string | null;
}

export default function UserActions({ user }: { user: User }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        // Tampilkan konfirmasi sebelum menghapus
        if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.full_name}"? Tindakan ini tidak bisa dibatalkan.`)) {
            startTransition(async () => {
                const result = await deleteUser(user.id);
                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success(result.message);
                }
            });
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Buka menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={isPending}
                    onSelect={handleDelete}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                    Hapus Pengguna
                </DropdownMenuItem>
                {/* TODO: Aksi lain seperti 'Bekukan Akun' bisa ditambahkan di sini */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}