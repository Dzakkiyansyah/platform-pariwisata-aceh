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
import { updateDestinationStatus, deleteDestination } from "@/app/(admin)/admin/destinasi/actions";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";

type Destination = {
    id: number;
    status: string;
    slug: string;
}

export default function DestinationActions({ destination }: { destination: Destination }) {
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (newStatus: 'published' | 'archived' | 'draft') => {
        startTransition(async () => {
            const result = await updateDestinationStatus(destination.id, newStatus);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.message);
            }
        });
    }

    const handleDelete = () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus destinasi ini? Semua data terkait (ulasan, foto, bookmark) akan dihapus permanen.")) {
            startTransition(async () => {
                const result = await deleteDestination(destination.id);
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
                
                {/* Aksi Ubah Status */}
                {destination.status !== 'published' && (
                    <DropdownMenuItem disabled={isPending} onSelect={() => handleStatusChange('published')}>
                        Publikasikan
                    </DropdownMenuItem>
                )}
                {destination.status === 'published' && (
                    <DropdownMenuItem disabled={isPending} onSelect={() => handleStatusChange('archived')} className="text-orange-600">
                        Arsipkan / Bekukan
                    </DropdownMenuItem>
                )}

                {/* Aksi Edit & Hapus */}
                <DropdownMenuItem asChild>
                    {/* Link ini akan mengarah ke halaman edit yang akan kita buat nanti */}
                    <Link href={`/admin/destinasi/edit/${destination.id}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={isPending}
                    onSelect={handleDelete}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                    Hapus Permanen
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}