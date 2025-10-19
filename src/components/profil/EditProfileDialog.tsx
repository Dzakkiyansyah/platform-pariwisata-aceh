'use client'

import { useState, useActionState, useEffect } from "react";
import { type ActionState } from "@/types/actions";
import { updateProfile } from "@/app/(main)/profil/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Edit } from "lucide-react";

type Profile = { full_name: string | null; avatar_url: string | null; };

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
}

export default function EditProfileDialog({ userProfile }: { userProfile: Profile }) {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(userProfile.avatar_url);
    const initialState: ActionState = {};
    const [state, formAction] = useActionState(updateProfile, initialState);

    useEffect(() => {
        if (state?.message) {
            toast.success(state.message);
            setOpen(false); 
        }
        if (state?.error) toast.error(state.error);
    }, [state]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Edit className="h-4 w-4 mr-2" />Edit Profil</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profil</DialogTitle>
                    <DialogDescription>Buat perubahan pada profil Anda. Klik simpan jika sudah selesai.</DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={preview || undefined} />
                            <AvatarFallback>{userProfile.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Input name="photo" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="fullName" className="text-right">Nama Lengkap</label>
                        <Input id="fullName" name="fullName" defaultValue={userProfile.full_name || ''} className="col-span-3" />
                    </div>
                    <input type="hidden" name="currentAvatarUrl" value={userProfile.avatar_url || ''} />
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}