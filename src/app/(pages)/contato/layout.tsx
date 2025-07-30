import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com o MT9 Notícias & Comércios - Estamos aqui para ajudar.",
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Contato - MT9 Notícias & Comércios",
    description:
      "Entre em contato com o MT9 Notícias & Comércios - Estamos aqui para ajudar.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
