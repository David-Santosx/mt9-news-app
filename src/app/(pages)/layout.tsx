import type { Metadata } from "next";
import Header from "../components/header";
import { Divider } from "@mantine/core";
import Footer from "../components/footer";

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <Divider my="md" />
      {children}
      <Footer />
    </main>
  );
}
