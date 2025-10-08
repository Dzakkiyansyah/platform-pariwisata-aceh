// src/components/admin/VerificationActions.tsx
'use client'

import { Button } from "@/components/ui/button";
import { getDocumentUrl, approvePengelola, rejectPengelola } from "@/app/(admin)/admin/verifikasi/actions";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
    profileId: string;
    documentPath: string;
}

export default function VerificationActions({ profileId, documentPath }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleViewDocument = async () => {
        const result = await getDocumentUrl(documentPath);
        if (result.error) {
            toast.error(result.error);
        } else {
            // Buka dokumen di tab baru
            window.open(result.url, '_blank');
        }
    }

    const handleApprove = async () => {
        setIsLoading(true);
        const result = await approvePengelola(profileId);
        if (result.error) toast.error(result.error);
        else toast.success(result.message);
        setIsLoading(false);
    }

    const handleReject = async () => {
        setIsLoading(true);
        // Tambahkan konfirmasi sebelum menolak
        if (window.confirm("Apakah Anda yakin ingin menolak pendaftar ini? Tindakan ini akan menghapus data pendaftar.")) {
            const result = await rejectPengelola(profileId);
            if (result.error) toast.error(result.error);
            else toast.success(result.message);
        }
        setIsLoading(false);
    }
    
    return (
        <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleViewDocument} disabled={isLoading}>Lihat Dokumen</Button>
            <Button variant="destructive" size="sm" onClick={handleReject} disabled={isLoading}>Tolak</Button>
            <Button size="sm" onClick={handleApprove} disabled={isLoading}>Setujui</Button>
        </div>
    )
}