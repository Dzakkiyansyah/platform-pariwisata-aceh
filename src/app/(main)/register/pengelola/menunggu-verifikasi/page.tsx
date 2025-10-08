// src/app/register/pengelola/menunggu-verifikasi/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function MenungguVerifikasiPage() {
    return (
        <div className="container mx-auto py-16 flex justify-center">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                        <MailCheck className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="mt-4">Pendaftaran Anda Sedang Ditinjau</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Terima kasih telah mendaftar. Tim kami akan segera memverifikasi data yang Anda ajukan. 
                        Anda akan menerima notifikasi melalui email setelah proses verifikasi selesai (estimasi 1-2 hari kerja).
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}