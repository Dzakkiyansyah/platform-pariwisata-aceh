// src/app/register/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    return(
        <div className="container mx-auto py-16">
            <Card className="mx-auto max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Bergabung dengan Platform Kami</CardTitle>
                    <CardDescription>
                        Pilih jenis akun yang sesuai dengan kebutuhan Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Opsi 1: Daftar sebagai Wisatawan */}
                        <Link href="/register/wisatawan">
                            <Card className="h-full hover:border-blue-500 hover:bg-slate-50 transition-all">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <User className="h-8 w-8 text-blue-600"/>
                                        <CardTitle>Sebagai Wisatawan</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Buat akun untuk memberi ulasan, menyimpan destinasi favorit, dan merencanakan perjalanan Anda.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Opsi 2: Daftar sebagai Pengelola */}
                        <Link href="/register/pengelola">
                              <Card className="h-full hover:border-blue-500 hover:bg-slate-50 transition-all">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <Building className="h-8 w-8 text-blue-600"/>
                                        <CardTitle>Sebagai Pengelola</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Daftarkan dan kelola informasi destinasi wisata Anda secara mandiri di platform resmi kami.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}