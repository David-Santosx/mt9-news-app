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
import { Notifications } from "@mantine/notifications";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const theme = createTheme({
  fontFamily: rubik.style.fontFamily,
});

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
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
