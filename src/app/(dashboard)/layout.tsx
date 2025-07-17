import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard - MT9 News",
    default: "Dashboard - MT9 News",
  },
  description:
    "Área administrativa do portal MT9 News - Gerencie conteúdo e configurações",
  robots: {
    index: false, // Dashboard não deve ser indexado
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Dashboard - MT9 Notícias & Comércios",
    description: "Área administrativa do portal MT9 Notícias & Comércios",
    type: "website",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
