"use client";
import { Box, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdPositionList } from "@/lib/schemas/ads-schema";
import { Advertisement as PrismaAds } from "@/../prisma/generated";
import { getPublicAds } from "../actions/publicidades/get-ads";

export default function AdDisplay({
  position,
  width,
  height,
}: {
  position: typeof AdPositionList;
  width: number;
  height: number;
}) {
  const [ads, setAds] = useState<PrismaAds[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAds() {
      try {
        setLoading(true);
        const data = await getPublicAds();
        if (!data) throw new Error("Falha ao carregar anúncios");

        // Filtra anúncios por posição e que estejam dentro do período de exibição
        const now = new Date();
        const validAds = data
          .filter((ad: PrismaAds) => {
            // Certifique-se que a posição seja a mesma
            if (!position.includes(ad.position)) return false;

            // Verifique se há uma imagem
            if (!ad.image) return false;

            // Verifique se o anúncio está dentro do período de exibição
            const startDate = new Date(ad.startDate);
            const endDate = new Date(ad.endDate);

            return startDate <= now && endDate >= now;
          })
          // Randomiza a ordem para começar com um anúncio diferente
          .sort(() => Math.random() - 0.5);

        setAds(validAds);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(`Erro ao buscar anúncios: ${err.message}`);
        } else {
          throw new Error("Erro desconhecido ao buscar anúncios");
        }
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
      }, 15000); // Altera a cada 15 segundos

      return () => clearInterval(timer); // Limpa o intervalo ao desmontar
    }
  }, [ads]);

  const ad = ads.length > 0 ? ads[currentIndex] : null;

  // Se estiver carregando, mostra um Skeleton
  if (loading) {
    return (
      <>
        <Box
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            borderRadius: "var(--mantine-radius-sm)",
          }}
        >
          <Skeleton height={height} width={width}>
            Publicidade
          </Skeleton>
        </Box>
      </>
    );
  }

  // Se não houver anúncios válidos, não renderiza nada
  if (!ad) {
    return null; // Não renderiza nada se não houver anúncios válidos
  }

  const AdContent = (
    <Box
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--mantine-radius-sm)",
      }}
    >
      <Image
        src={ad.image || ""}
        alt={ad.campaing}
        unoptimized
        unselectable="on"
        fill
        sizes={`(max-width: 768px) 100vw, ${width}px`}
        style={{
          objectFit: "contain",
          objectPosition: "center",
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
        position: "relative",
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
        position: "relative",
      }}
    >
      {AdContent}
    </Box>
  );
}
