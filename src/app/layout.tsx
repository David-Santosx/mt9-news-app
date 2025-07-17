import { Rubik } from "next/font/google";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import "./globals.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import type { Metadata } from "next";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const theme = createTheme({
  fontFamily: rubik.style.fontFamily,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    template: "%s | MT9 News",
    default: "MT9 Notícias & Comércios - Confie e se informe",
  },
  description:
    "MT9 Notícias e Comércios - Seu portal de notícias confiável e atualizado. Fique por dentro das últimas notícias, eventos e ofertas da sua região.",
  keywords: [
    "notícias",
    "MT9",
    "portal",
    "informação",
    "jornalismo",
    "atualidades",
    "comércios",
    "mato grosso",
  ],
  authors: [{ name: "David Santos" }],
  creator: "David Santos",
  publisher: "David Santos",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    siteName: "MT9 Notícias & Comércios",
    title: "MT9 Notícias & Comércios - Confie e se informe",
    description:
      "MT9 Notícias e Comércios - Seu portal de notícias confiável e atualizado. Fique por dentro das últimas notícias, eventos e ofertas da sua região.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`antialiased`}>
        <MantineProvider theme={theme} withGlobalClasses withCssVariables>
          <Notifications />
          <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
