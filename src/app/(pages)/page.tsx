import HeroNewsCarousel from "@/app/components/hero-news-carousel";
import HomeNewsSections from "@/app/components/home-news-sections";

export default function Page() {
  return (
    <>
      {/* Seção Hero com Carousel de Notícias */}
      <HeroNewsCarousel />

      {/* Seções de notícias por categoria */}
      <HomeNewsSections />
    </>
  );
}
