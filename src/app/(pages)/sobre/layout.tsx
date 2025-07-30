import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça mais sobre o MT9 Notícias & Comércios - Nossa missão, visão e valores.",
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Sobre - MT9 Notícias & Comércios",
    description:
      "Conheça mais sobre o MT9 Notícias & Comércios - Nossa missão, visão e valores.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
