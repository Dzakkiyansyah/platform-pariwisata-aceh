import HeroSection from "@/components/landing/HeroSection";
import CategoriesSection from "@/components/landing/CategoriesSection";
import ReviewSlider from "@/components/landing/ReviewSlider";
import CtaSection from "@/components/landing/CtaSection";
import PopularDestinations from "@/components/landing/PopularDestinations";
import LatestNews from "@/components/landing/LatestNews";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Ambil data ulasan (di server)
  const { data: reviews, error } = await supabase
    .rpc('get_reviews_with_profiles', { review_limit: 5 });

  if (error) {
    console.error("Error fetching reviews for Home page:", error);
  }

  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <PopularDestinations />
      <LatestNews />
      
      {/* Kirim data ulasan sebagai prop ke ReviewSlider */}
      <ReviewSlider initialReviews={reviews || []} />
      
      <CtaSection />
    </main>
  );
}