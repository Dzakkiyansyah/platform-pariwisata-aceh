'use client'

import { useActionState, useEffect, useState, useTransition, useRef } from "react";
import { uploadPhotos, deletePhoto } from "@/app/(pengelola)/pengelola/destinasi/actions";
import { type ActionState } from "@/types/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { X } from "lucide-react";

type Photo = { id: number, photo_path: string };
type Props = { destinationId: number, initialPhotos: Photo[] };

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? "Mengunggah..." : "Unggah Foto Terpilih"}</Button>;
}

export default function GaleriForm({ destinationId, initialPhotos }: Props) {
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDeleting, startDeleteTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const initialState: ActionState = {};
    const [state, formAction] = useActionState(uploadPhotos, initialState);

    useEffect(() => {
        if (state?.message) {
            toast.success(state.message);
            setPreviews([]); // Clear previews after successful upload
            if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        }
        if (state?.error) toast.error(state.error);
    }, [state]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setPreviews(fileArray);
        }
    };

    const handleDeletePhoto = (photoId: number, photoPath: string) => {
        if (window.confirm("Yakin ingin menghapus foto ini?")) {
            startDeleteTransition(async () => {
                await deletePhoto(photoId, photoPath);
                toast.success("Foto berhasil dihapus.");
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Galeri Foto</CardTitle>
                <CardDescription>Unggah beberapa foto untuk ditampilkan di halaman detail destinasi Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4 border-b pb-8 mb-8">
                    <input type="hidden" name="destinationId" value={destinationId} />
                    <div className="grid gap-2">
                        <label className="font-medium" htmlFor="photos">Pilih Foto (bisa lebih dari satu)</label>
                        <Input id="photos" name="photos" type="file" accept="image/*" multiple onChange={handleFileChange} ref={fileInputRef} />
                    </div>
                    {previews.length > 0 && (
                        <div className="space-y-4">
                            <p className="text-sm font-medium">Preview Foto Baru:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {previews.map((src, i) => <Image key={i} src={src} alt="preview" width={150} height={100} className="rounded-md object-cover aspect-[3/2]" />)}
                            </div>
                            <SubmitButton />
                        </div>
                    )}
                </form>

                <div className="space-y-4">
                     <h4 className="font-semibold">Foto yang Sudah Diunggah:</h4>
                     {initialPhotos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {initialPhotos.map(photo => (
                                <div key={photo.id} className="relative group">
                                    <Image src={photo.photo_path} alt="Uploaded photo" width={150} height={100} className="rounded-md object-cover aspect-[3/2] bg-muted" />
                                    <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeletePhoto(photo.id, photo.photo_path)} disabled={isDeleting}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                     ) : <p className="text-sm text-muted-foreground">Belum ada foto yang diunggah.</p>}
                </div>
            </CardContent>
        </Card>
    );
}