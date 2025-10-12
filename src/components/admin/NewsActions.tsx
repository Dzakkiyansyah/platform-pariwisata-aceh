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
import { deleteNews } from "@/app/(admin)/admin/berita/actions"; 
// --------------------------------------------------
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";

type News = {
    id: number;
    title: string;
    image_path: string | null;
}

export default function NewsActions({ news }: { news: News }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!news.image_path) {
            toast.error("Path gambar tidak ditemukan, tidak bisa menghapus.");
            return;
        }
        if (window.confirm(`Apakah Anda yakin ingin menghapus berita "${news.title}"?`)) {
            startTransition(async () => {
                const result = await deleteNews(news.id, news.image_path!);
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
                <DropdownMenuItem asChild>
                    <Link href="#">Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={isPending}
                    onSelect={handleDelete}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                    Hapus
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}