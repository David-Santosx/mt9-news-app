import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciar Notícias",
  description:
    "Gerencie todas as notícias do portal MT9 Notícias - Criar, editar e excluir artigos",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Gerenciar Notícias - Dashboard MT9 Notícias & Comércios",
    description:
      "Área de administração para gerenciar notícias do portal MT9 Notícias & Comércios",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
