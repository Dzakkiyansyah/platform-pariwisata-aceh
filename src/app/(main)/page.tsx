import HeroSection from "@/components/landing/HeroSection";
import CategoriesSection from "@/components/landing/CategoriesSection";
import PopularDestinations from "@/components/landing/PopularDestinations";
import LatestNews from "@/components/landing/LatestNews";
import ReviewSlider from "@/components/landing/ReviewSlider";
import CtaSection from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <PopularDestinations />
      <LatestNews />
      <ReviewSlider />
      <CtaSection />
    </main>
  );
}