'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type ReviewFormProps = {
  destinationId: number;
  userId: string;
};

export default function ReviewForm({ destinationId, userId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Harap berikan rating bintang terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      destination_id: destinationId,
      user_id: userId,
      rating: rating,
      comment: comment,
    });

    if (error) {
      toast.error("Gagal mengirim ulasan. Coba lagi nanti.");
      console.error("Error inserting review:", error);
    } else {
      toast.success("Ulasan Anda berhasil dikirim!");
      setRating(0);
      setComment("");
      // Refresh halaman untuk menampilkan ulasan baru
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="border rounded-lg p-6 mb-6">
      <h3 className="font-semibold mb-4">Tulis Ulasan Anda</h3>
      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm text-muted-foreground">Rating Anda:</p>
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-6 w-6 cursor-pointer transition-all ${
                (hoverRating || rating) > i
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>
      </div>
      <Textarea
        placeholder="Bagikan pengalaman Anda di sini..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />
      <Button onClick={handleSubmit} disabled={isSubmitting} className="mt-4">
        {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
      </Button>
    </div>
  );
}