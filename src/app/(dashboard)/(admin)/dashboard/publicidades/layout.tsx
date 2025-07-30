import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciar Publicidades",
  description:
    "Gerencie todas as publicidades do portal MT9 Notícias - Criar, editar e excluir anúncios",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Gerenciar Publicidades - Dashboard MT9 Notícias & Comércios",
    description:
      "Área de administração para gerenciar publicidades do portal MT9 Notícias & Comércios",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
