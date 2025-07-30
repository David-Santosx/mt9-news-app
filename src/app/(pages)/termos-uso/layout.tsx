import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Leia os termos de uso do portal MT9 Notícias - Entenda suas responsabilidades e direitos ao utilizar nossos serviços.",
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Termos de Uso - MT9 Notícias & Comércios",
    description:
      "Leia os termos de uso do portal MT9 Notícias & Comércios - Entenda suas responsabilidades e direitos ao utilizar nossos serviços.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
