'use client'

import { useActionState, useEffect } from "react";
import { updateDeskripsi } from "@/app/(pengelola)/pengelola/destinasi/actions";
import { type ActionState } from "@/types/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// 🧠 Pastikan destination punya id juga
type Destination = { 
  id?: number | string;
  description: string | null; 
  facilities: string[] | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

export default function DeskripsiForm({ destination }: { destination: Destination }) {
  const initialState: ActionState = {};
  const [state, formAction] = useActionState(updateDeskripsi, initialState);

  useEffect(() => {
    if (state?.message) toast.success(state.message);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction}>
      {/* ✅ Hidden input biar ID dikirim ke server */}
      <input type="hidden" name="destination_id" value={destination.id || ''} />

      <Card>
        <CardHeader>
          <CardTitle>Deskripsi & Fasilitas</CardTitle>
          <CardDescription>
            Jelaskan keunikan destinasi Anda kepada pengunjung.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label>Deskripsi Lengkap</label>
            <Textarea
              name="description"
              defaultValue={destination.description || ''}
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <label>Fasilitas</label>
            <Input
              name="facilities"
              defaultValue={destination.facilities?.join(', ') || ''}
              placeholder="Contoh: Area Parkir, Toilet, Warung Makan"
            />
            <p className="text-xs text-muted-foreground">
              Pisahkan setiap fasilitas dengan koma.
            </p>
          </div>
        </CardContent>

        <CardFooter className="border-t px-6 py-4">
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
