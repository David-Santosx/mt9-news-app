"use client";
import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export enum AdPosition {
  HEADER = "HEADER",
  HIGHLIGHT = "HIGHLIGHT"
}

interface Advertisement {
  id: string;
  campaing: string;
  image: string | null;
  link: string | null;
  position: AdPosition;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdDisplay({
  position,
  width,
  height,
}: {
  position: AdPosition;
  width: number;
  height: number;
}) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAds() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/publicidades");
        if (!response.ok) throw new Error("Falha ao carregar anúncios");
        
        const data = await response.json();
        // Filtra anúncios por posição e que estejam dentro do período de exibição
        const now = new Date();
        const validAds = data.ads
          .filter((ad: Advertisement) => {
            // Certifique-se que a posição seja a mesma
            if (ad.position !== position) return false;
            
            // Verifique se há uma imagem
            if (!ad.image) return false;
            
            // Verifique se o anúncio está dentro do período de exibição
            const startDate = new Date(ad.startDate);
            const endDate = new Date(ad.endDate);
            
            return startDate <= now && endDate >= now;
          })
          // Randomiza a ordem para começar com um anúncio diferente
          .sort(() => Math.random() - 0.5);

        console.log(`Encontrados ${validAds.length} anúncios válidos para posição ${position}`);
        
        setAds(validAds);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao carregar anúncios:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAds();
  }, [position]);

  // Efeito para o carrossel de anúncios
  useEffect(() => {
    if (ads.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 5000); // Altera a cada 5 segundos

      return () => clearInterval(timer); // Limpa o intervalo ao desmontar
    }
  }, [ads]);

  const ad = ads.length > 0 ? ads[currentIndex] : null;

  // Se estiver carregando, ainda está buscando os anúncios
  if (loading) {
    return null; // Não renderiza nada enquanto carrega
  }

  // Se houver erro ou não tiver anúncio disponível, não renderiza nada
  if (error || !ad) {
    return null;
  }

  const AdContent = (
    <Box
      style={{ 
        width: "100%", 
        height: "100%", 
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--mantine-radius-sm)"
      }}
    >
      <Image
        src={ad.image || ""}
        alt={ad.campaing}
        fill
        sizes={`(max-width: 768px) 100vw, ${width}px`}
        style={{ 
          objectFit: "contain",
          objectPosition: "center"
        }}
      />
    </Box>
  );

  // Se tiver link, envolve em um Link, caso contrário retorna só o conteúdo
  return ad.link ? (
    <Link
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        display: "block", 
        width: "100%",
        maxWidth: width,
        height: height,
        position: "relative" 
      }}
    >
      {AdContent}
    </Link>
  ) : (
    <Box
      style={{ 
        display: "block", 
        width: "100%",
        maxWidth: width,
        height: height,
        position: "relative" 
      }}
    >
      {AdContent}
    </Box>
  );
}
