'use client'

import { useActionState, useEffect, useState } from "react";
import { updateInfoUmum } from "@/app/(pengelola)/pengelola/destinasi/actions";
import { type ActionState } from "@/types/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

type Destination = { name: string, category_id: number, address: string, open_time: string, ticket_price: string, website: string | null };
type Category = { id: number, name: string };

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan Perubahan"}</Button>;
}

export default function InfoUmumForm({ destination }: { destination: Destination }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const initialState: ActionState = {};
    const [state, formAction] = useActionState(updateInfoUmum, initialState);

    useEffect(() => {
        if (state?.message) toast.success(state.message);
        if (state?.error) toast.error(state.error);

        const supabase = createClient();
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('id, name');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, [state]);
    
    return (
        <form action={formAction}>
            <Card>
                <CardHeader><CardTitle>Informasi Umum</CardTitle><CardDescription>Perbarui detail dasar dari destinasi Anda.</CardDescription></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2"><label>Nama Destinasi</label><Input name="name" defaultValue={destination.name} required /></div>
                    <div className="space-y-2"><label>Kategori</label>
                        <Select name="category_id" defaultValue={destination.category_id.toString()} required>
                            <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                            <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 col-span-2"><label>Alamat</label><Input name="address" defaultValue={destination.address} required /></div>
                    <div className="space-y-2"><label>Jam Operasional</label><Input name="open_time" defaultValue={destination.open_time} required /></div>
                    <div className="space-y-2"><label>Harga Tiket (opsional)</label><Input name="ticket_price" defaultValue={destination.ticket_price} placeholder="Gratis" /></div>
                    <div className="space-y-2 col-span-2"><label>Website (opsional)</label><Input name="website" defaultValue={destination.website || ''} /></div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4"><SubmitButton /></CardFooter>
            </Card>
        </form>
    );
}