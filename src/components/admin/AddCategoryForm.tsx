// src/components/admin/AddCategoryForm.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormStatus } from 'react-dom';
import { addCategory } from "@/app/(admin)/admin/kategori/actions";
import { toast } from "sonner";
import { useRef } from "react";

// Tombol ini akan otomatis menampilkan status "pending" saat form disubmit
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Menyimpan..." : "Tambah Kategori"}
        </Button>
    )
}

export default function AddCategoryForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleFormAction = async (formData: FormData) => {
        const result = await addCategory(formData);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Kategori berhasil ditambahkan!");
            // Reset form setelah berhasil
            formRef.current?.reset();
        }
    }

    return (
        <form ref={formRef} action={handleFormAction} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
            <Input 
                name="name"
                placeholder="Nama Kategori Baru (contoh: Wisata Kuliner)"
                required
                className="flex-grow"
            />
            <SubmitButton />
        </form>
    )
}