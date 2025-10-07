// src/components/landing/ReviewSlider.tsx
'use client'

import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ReviewCard from '../shared/ReviewCard'
import { Button } from '../ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client' // <-- Impor Supabase client

// Definisikan tipe untuk data ulasan
type Review = {
    id: number;
    comment: string;
    rating: number;
    // Nanti kita akan tambahkan data user seperti nama dan avatar
}

const ReviewSlider = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Hook dari Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: reviews.length > 2, align: 'start' })

  // Fungsi untuk mengambil data ulasan dari Supabase
  useEffect(() => {
    const fetchReviews = async () => {
      // Ambil 5 ulasan terbaru
      const { data, error } = await supabase
        .from('reviews')
        .select('id, comment, rating')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        // Hapus ulasan yang tidak punya komentar untuk ditampilkan di landing page
        const validReviews = data.filter(review => review.comment);
        setReviews(validReviews as any);
      }
      setIsLoading(false);
    };

    fetchReviews();
  }, []); // <-- [] berarti hanya dijalankan sekali saat komponen dimuat

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Tampilan Loading
  if (isLoading) {
    return <section className="bg-slate-50 py-16"><div className="container text-center">Memuat ulasan...</div></section>;
  }

  return (
    <section className="bg-slate-50 py-16">
        <div className="container mx-auto">
            {/* Judul Section & Tombol Navigasi */}
            <div className="flex justify-between items-center mb-10">
                <div className="text-left">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Ulasan Terbaik dari Para Penjelajah
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Pengalaman nyata dari mereka yang telah mengunjungi Banda Aceh.
                    </p>
                </div>
                {/* Hanya tampilkan tombol jika ada ulasan */}
                {reviews.length > 0 && (
                    <div className="hidden md:flex gap-2">
                        <Button variant="outline" size="icon" onClick={scrollPrev}><ArrowLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" onClick={scrollNext}><ArrowRight className="h-4 w-4" /></Button>
                    </div>
                )}
            </div>

            {/* Tampilan Conditional: Carousel ATAU CTA */}
            {reviews.length > 0 ? (
                // Tampilkan Carousel jika ada ulasan
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="flex-grow-0 flex-shrink-0 w-full md:w-1/3">
                                <ReviewCard 
                                    rating={review.rating} 
                                    text={review.comment}
                                    // Untuk sekarang, kita gunakan data statis untuk author
                                    author="Wisatawan"
                                    avatarUrl="https://github.com/shadcn.png"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Tampilkan CTA jika tidak ada ulasan
                <div className="text-center border-2 border-dashed rounded-lg p-12">
                    <h3 className="text-2xl font-semibold">Belum Ada Ulasan</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        Jadilah yang pertama memberikan ulasan! Jelajahi destinasi yang ada dan bagikan pengalaman Anda.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/destinasi">Lihat Semua Destinasi</Link>
                    </Button>
                </div>
            )}
        </div>
    </section>
  )
}

export default ReviewSlider