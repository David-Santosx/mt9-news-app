import { Container, Title, Text, Button, Stack } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className="flex items-center justify-center">
      <Stack align="center" gap="xl" className="py-8 px-4 sm:py-24">
        <Title
          order={1}
          className="text-[8rem] sm:text-[12rem] font-black text-blue-500 drop-shadow-lg animate-bounce"
        >
          404
        </Title>

        <Title order={2} className="text-2xl sm:text-4xl font-bold text-center">
          Notícia não encontrada
        </Title>

        <Text
          c="dimmed"
          className="text-md sm:text-lg text-center max-w-[600px] px-4"
        >
          Infelizmente, esta página não existe. Você pode ter digitado o
          endereço incorretamente, ou a notícia foi movida para outro local.
        </Text>

        <Button
          component={Link}
          href="/"
          size="lg"
          variant="light"
          leftSection={<ArrowLeft size={20} />}
          className="mt-8 transition-transform duration-200 hover:scale-105"
        >
          Voltar para a página inicial
        </Button>
      </Stack>
    </Container>
  );
}
