// src/components/landing/LandingReviewForm.tsx
'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

// Tambahkan prop onClose
type FormProps = {
    onReviewSubmit: () => void;
    onClose: () => void;
}

export default function LandingReviewForm({ onReviewSubmit, onClose }: FormProps) {
    // ... (state lainnya tidak berubah)
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [name, setName] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        getUser();
    }, []);

    const handleSubmit = async () => {
        // ... (validasi tidak berubah)
        if (rating === 0) return toast.error("Harap berikan rating bintang.");
        if (!user && !name) return toast.error("Harap masukkan nama Anda.");
        if (!comment) return toast.error("Harap isi ulasan Anda.");

        setIsSubmitting(true);

        const reviewData = {
            rating,
            comment,
            user_id: user ? user.id : null,
            anonymous_name: user ? null : name,
            destination_id: null
        };

        const { error } = await supabase.from("reviews").insert(reviewData);

        if (error) {
            toast.error("Gagal mengirim ulasan. Coba lagi.");
            console.error(error);
        } else {
            toast.success("Terima kasih atas ulasan Anda!");
            onReviewSubmit(); // Panggil refresh data
            onClose(); // <-- Panggil fungsi untuk menutup form
        }
        setIsSubmitting(false);
    };

    return (
        <div className="relative text-left border-2 border-dashed rounded-lg p-8 space-y-4 max-w-2xl mx-auto">
            {/* Tombol Close */}
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
                <X className="h-4 w-4" />
            </Button>
            
            <h3 className="text-2xl font-semibold text-center">Bagikan Pengalaman Anda!</h3>
            {/* ... (sisa form tidak berubah) ... */}
            {!user && (
                 <div className="grid gap-2">
                    <label htmlFor="name">Nama Anda</label>
                    <Input id="name" placeholder="Masukkan nama Anda" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
            )}
            <div className="grid gap-2">
                <label>Rating</label>
                <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`h-7 w-7 cursor-pointer transition-all ${ (hoverRating || rating) > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300" }`}
                            onMouseEnter={() => setHoverRating(i + 1)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(i + 1)} />
                    ))}
                </div>
            </div>
            <div className="grid gap-2">
                <label htmlFor="review">Ulasan Anda</label>
                <Textarea id="review" placeholder="Ceritakan pengalaman Anda mengunjungi Banda Aceh..." value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
        </div>
    );
}