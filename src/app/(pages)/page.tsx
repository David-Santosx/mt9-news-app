import { Container } from "@mantine/core";
import HeroNewsCarousel from "@/app/components/hero-news-carousel";

export default function Page() {
  return (
    <>
      {/* Seção Hero com Carousel de Notícias */}
      <HeroNewsCarousel />
      
      <Container>
        {/* Conteúdo adicional da página pode ser adicionado aqui */}
      </Container>
    </>
  );
}
