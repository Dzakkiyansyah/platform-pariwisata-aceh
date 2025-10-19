'use client'

import { useState, useTransition } from "react";
import { toggleBookmark } from "@/app/(main)/destinasi/actions";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
    destinationId: number;
    isBookmarked: boolean;
    isLoggedIn: boolean;
}

export default function BookmarkButton({ destinationId, isBookmarked: initialIsBookmarked, isLoggedIn }: Props) {
    const router = useRouter();
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        if (!isLoggedIn) {
            router.push('/login'); // Arahkan ke login jika belum masuk
            return;
        }

        startTransition(async () => {
            const result = await toggleBookmark(destinationId, isBookmarked);
            if (result.error) {
                toast.error(result.error);
            } else {
                setIsBookmarked(!isBookmarked); // Update state tombol secara lokal
                toast.success(result.message);
            }
        });
    }

    return (
        <Button 
            variant="outline" 
            className="w-full"
            onClick={handleClick}
            disabled={isPending}
        >
            <Bookmark className={`h-4 w-4 mr-2 transition-colors ${isBookmarked ? 'fill-yellow-400 text-yellow-500' : ''}`} />
            {isBookmarked ? 'Tersimpan di Rencana' : 'Simpan ke Rencana'}
        </Button>
    );
}