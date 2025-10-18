'use client'

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ReviewCard from '../shared/ReviewCard'
import { Button } from '../ui/button'
import { ArrowLeft, ArrowRight, Edit } from 'lucide-react'
import LandingReviewForm from './LandingReviewForm'

// Tipe data yang diterima dari parent
type ReviewWithProfile = {
    id: number;
    comment: string;
    rating: number;
    anonymous_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
}

// Komponen sekarang menerima 'initialReviews' sebagai prop
export default function ReviewSlider({ initialReviews }: { initialReviews: ReviewWithProfile[] }) {
  // Hapus semua logika fetch, useEffect, dan useState untuk reviews & isLoading
  const [reviews, setReviews] = React.useState(initialReviews);
  const [isFormVisible, setIsFormVisible] = React.useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: reviews.length > 2, align: 'start' });

  // Fungsi untuk me-refresh data (akan kita butuhkan lagi nanti)
  const handleReviewSubmit = () => {
    // Untuk sekarang, kita hanya menutup form. Refresh otomatis akan ditangani oleh Server Actions.
    setIsFormVisible(false);
    // Kita akan menambahkan revalidasi di action form nanti
  }

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-slate-50 py-16">
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div className="text-left">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Ulasan dari Para Penjelajah
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Pengalaman nyata dari mereka yang telah mengunjungi Banda Aceh.
                    </p>
                </div>
                
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Tulis Ulasan Anda
                    </Button>
                )}
            </div>

            {isFormVisible ? (
                <LandingReviewForm 
                    onReviewSubmit={handleReviewSubmit} 
                    onClose={() => setIsFormVisible(false)}
                />
            ) : (
                <>
                    {reviews.length > 0 ? (
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex gap-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="flex-grow-0 flex-shrink-0 w-full md:w-1/3">
                                        <ReviewCard 
                                            rating={review.rating} 
                                            text={review.comment!}
                                            author={review.full_name || review.anonymous_name || 'Wisatawan'}
                                            avatarUrl={review.avatar_url}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Belum ada ulasan. Jadilah yang pertama!</p>
                        </div>
                    )}
                </>
            )}
        </div>
    </section>
  )
}