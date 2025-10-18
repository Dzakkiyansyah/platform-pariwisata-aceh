import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InfoUmumForm from "@/components/pengelola/forms/InfoUmumForm";
import DeskripsiForm from "@/components/pengelola/forms/DeskripsiForm";
import LokasiForm from "@/components/pengelola/forms/LokasiForm";
import GaleriForm from "@/components/pengelola/forms/GaleriForm"; // <-- Import GaleriForm

export default async function KelolaDestinasiPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Fetch the destination AND its related photos
    const { data: destination } = await supabase
        .from('destinations')
        .select('*, destination_photos(*)')
        .eq('user_id', user.id)
        .single();
    
    if (!destination) { return <div>Anda belum memiliki destinasi.</div> }
    
    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold">Kelola: {destination.name}</h1><p className="text-muted-foreground mt-1">Perbarui semua informasi terkait destinasi Anda di sini.</p></div>
            <Tabs defaultValue="info-umum">
                <TabsList className="grid w-full grid-cols-4"><TabsTrigger value="info-umum">Informasi Umum</TabsTrigger><TabsTrigger value="deskripsi">Deskripsi & Fasilitas</TabsTrigger><TabsTrigger value="galeri">Galeri Foto</TabsTrigger><TabsTrigger value="lokasi">Lokasi Peta</TabsTrigger></TabsList>
                <TabsContent value="info-umum" className="mt-4"><InfoUmumForm destination={destination as any} /></TabsContent>
                <TabsContent value="deskripsi" className="mt-4"><DeskripsiForm destination={destination as any} /></TabsContent>
                <TabsContent value="lokasi" className="mt-4"><LokasiForm destination={destination as any} /></TabsContent>
                {/* Replace the placeholder with the new functional component */}
                <TabsContent value="galeri" className="mt-4">
                    <GaleriForm 
                        destinationId={destination.id} 
                        initialPhotos={destination.destination_photos} 
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}