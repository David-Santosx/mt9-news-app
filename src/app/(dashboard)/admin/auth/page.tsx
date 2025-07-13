import { Container, Divider, Flex, Text, Paper, Title } from "@mantine/core";
import { Metadata } from "next";
import AuthForm from "./components/auth-form";

export const metadata: Metadata = {
  title: "Autenticação - MT9 Notícias & Comércios",
  description:
    "Página de autenticação para administradores do MT9 Notícias & Comércios",
};

export default function Page() {
  return (
    <Container h={"100dvh"} bg={"blue"} py={"xl"}>
      <Flex w={"100%"} h={"100%"} justify={"center"} align={"center"}>
        <Paper radius={"md"} p={30} shadow="md" withBorder>
          <Title>Faça o seu login</Title>
          <Text>Conecte-se para ter acesso ao conteúdo do site.</Text>
          <Divider my="lg" />
          <AuthForm />
        </Paper>
      </Flex>
    </Container>
  );
}
