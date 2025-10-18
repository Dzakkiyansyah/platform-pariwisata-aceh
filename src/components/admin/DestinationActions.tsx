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
import { updateDestinationStatus } from "@/app/(admin)/admin/destinasi/actions";
import { toast } from "sonner";
import { useTransition } from "react";

// Tipe data untuk destinasi yang diterima
type Destination = {
    id: number;
    status: string;
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
                {destination.status !== 'published' && (
                    <DropdownMenuItem 
                        disabled={isPending}
                        onSelect={() => handleStatusChange('published')}
                    >
                        Publikasikan
                    </DropdownMenuItem>
                )}
                {destination.status === 'published' && (
                    <DropdownMenuItem 
                        disabled={isPending}
                        onSelect={() => handleStatusChange('archived')}
                        className="text-red-600"
                    >
                        Arsipkan / Bekukan
                    </DropdownMenuItem>
                )}
                 {/* TODO: Tambahkan aksi Edit dan Hapus di sini */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}