// src/components/landing/ReviewSlider.tsx
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ReviewCard from '../shared/ReviewCard'
import { Button } from '../ui/button'
import { ArrowLeft, ArrowRight, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import LandingReviewForm from './LandingReviewForm'

// Sesuaikan tipe data dengan apa yang dikembalikan oleh fungsi PostgreSQL
type ReviewFromFunction = {
    id: number;
    comment: string;
    rating: number;
    anonymous_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
}

const ReviewSlider = () => {
  const [reviews, setReviews] = useState<ReviewFromFunction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const supabase = createClient();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: reviews.length > 2, align: 'start' });

  // Ubah fungsi fetch untuk memanggil RPC
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    // Panggil fungsi 'get_reviews_with_profiles' dengan parameter limit 5
    const { data, error } = await supabase
      .rpc('get_reviews_with_profiles', { review_limit: 5 });

    if (error) {
      console.error('Error fetching reviews via RPC:', error);
    } else {
      setReviews(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (isLoading) {
    return <section className="bg-slate-50 py-16"><div className="container text-center">Memuat ulasan...</div></section>;
  }

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
                    onReviewSubmit={fetchReviews} 
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
                                            text={review.comment}
                                            // Gunakan data dari fungsi
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

export default ReviewSlider;