import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";

const CtaSection = () => {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container mx-auto text-center">
        {/* Judul dan Deskripsi */}
        <h2 className="text-3xl font-bold tracking-tight">
          Apakah Anda Pengelola Destinasi Wisata?
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-blue-100">
          Bergabunglah dengan platform digital resmi kami untuk menjangkau
          jutaan wisatawan, mengelola informasi destinasi Anda secara mandiri,
          dan menjadi bagian dari ekosistem pariwisata modern di Banda Aceh.
        </p>

        {/* Kotak Keuntungan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
          <Card className="bg-blue-700 border-blue-500">
            <CardHeader>
              <Globe className="h-8 w-8 text-blue-300" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-white">Jangkauan Luas</CardTitle>
              <p className="text-blue-200 mt-2">
                Promosikan destinasi Anda kepada wisatawan lokal dan
                mancanegara.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-700 border-blue-500">
            <CardHeader>
              <Users className="h-8 w-8 text-blue-300" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-white">Pengelolaan Mandiri</CardTitle>
              <p className="text-blue-200 mt-2">
                Update informasi, galeri foto, dan detail destinasi secara
                real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-700 border-blue-500">
            <CardHeader>
              <ShieldCheck className="h-8 w-8 text-blue-300" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-white">Sertifikasi Resmi</CardTitle>
              <p className="text-blue-200 mt-2">
                Tampil sebagai mitra terverifikasi oleh Dinas Pariwisata Kota
                Banda Aceh.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Button
            asChild
            size="lg"
            className="h-10 px-4 text-sm"
          >
            <Link href="/daftar-pengelola">Daftar Sebagai Pengelola →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;