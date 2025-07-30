import Header from "../components/header";
import { Divider } from "@mantine/core";
import Footer from "../components/footer";
import { Container } from "@mantine/core";
import { NewsTicker } from "../components/news-ticker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <main>
      <Header />
      <NewsTicker />
      <Divider my="md" />
      <Container size="xl">{children}</Container>
      <Footer />
    </main>
  );
}
