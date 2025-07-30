import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Leia a política de privacidade do portal MT9 Notícias - Entenda como coletamos, usamos e protegemos suas informações.",
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Política de Privacidade - MT9 Notícias & Comércios",
    description:
      "Leia a política de privacidade do portal MT9 Notícias & Comércios - Entenda como coletamos, usamos e protegemos suas informações.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
