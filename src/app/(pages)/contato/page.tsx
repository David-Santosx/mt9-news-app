"use client";

import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Box,
  TextInput,
  Textarea,
  Button,
  SimpleGrid,
  ThemeIcon,
  Flex,
  Card,
} from "@mantine/core";
import {
  Mail,
  Phone,
  Clock,
  Send,
  MessageSquare,
  Building,
  AtSign,
  Headphones,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

export default function Page() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value) =>
        value.trim().length < 3
          ? "Nome deve ter pelo menos 3 caracteres"
          : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
      subject: (value) =>
        value.trim().length < 5
          ? "Assunto deve ter pelo menos 5 caracteres"
          : null,
      message: (value) =>
        value.trim().length < 10
          ? "Mensagem deve ter pelo menos 10 caracteres"
          : null,
    },
  });

  const handleSubmit = () => {
    // Aqui implementaríamos o envio do formulário
    notifications.show({
      title: "Mensagem Enviada",
      message: "Sua mensagem foi enviada com sucesso!",
      color: "green",
    });
    form.reset();
  };

  return (
    <Container size="xl" py="xl">
      {/* Cabeçalho */}
      <Box
        bdrs="md"
        className="bg-[var(--mantine-color-blue-3)]"
        style={{
          position: "relative",
          backgroundBlendMode: "multiply",
        }}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={{
            padding: "5rem 2rem",
            textAlign: "center",
          }}
        >
          <Image
            src="/images/mt9-logo.svg"
            width={180}
            height={100}
            alt="MT9 Notícias e Comércios"
            style={{ marginBottom: "1.5rem" }}
          />
          <Title
            order={1}
            c="white"
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              marginBottom: "1rem",
            }}
          >
            Entre em Contato
          </Title>
          <Text
            c="white"
            size="xl"
            style={{
              maxWidth: "800px",
              fontWeight: 500,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          >
            Estamos à disposição para atender você
          </Text>
        </Flex>
      </Box>

      {/* Formulário de Contato */}
      <Paper
        shadow="md"
        radius="lg"
        withBorder
        p="xl"
        style={{
          marginTop: "-2rem",
          position: "relative",
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
          <Stack>
            <Title order={2} size="h3" mb="md">
              Envie uma mensagem
            </Title>

            <form
              onSubmit={form.onSubmit(handleSubmit)}
              method="POST"
            >
              <Stack gap="md">
                <TextInput
                  withAsterisk
                  label="Nome"
                  name="name"
                  placeholder="Seu nome completo"
                  {...form.getInputProps("name")}
                  leftSection={<AtSign size={16} />}
                />

                <TextInput
                  withAsterisk
                  label="Email"
                  name="email"
                  placeholder="seu.email@exemplo.com"
                  {...form.getInputProps("email")}
                  leftSection={<Mail size={16} />}
                />

                <TextInput
                  withAsterisk
                  label="Assunto"
                  name="subject"
                  placeholder="Sobre o que deseja falar?"
                  {...form.getInputProps("subject")}
                  leftSection={<MessageSquare size={16} />}
                />

                <Textarea
                  withAsterisk
                  label="Mensagem"
                  name="message"
                  placeholder="Escreva sua mensagem aqui..."
                  minRows={4}
                  {...form.getInputProps("message")}
                />

                <Button
                  type="submit"
                  leftSection={<Send size={16} />}
                  fullWidth
                  mt="md"
                >
                  Enviar Mensagem
                </Button>
              </Stack>
            </form>
          </Stack>

          <Stack>
            <Title order={2} size="h3" mb="md">
              Informações de Contato
            </Title>

            <Card withBorder p="lg" radius="md" shadow="sm">
              <Stack gap="xl">
                <Group>
                  <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                    <Mail size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={500}>Email</Text>
                    <Text size="sm" c="dimmed">
                      contato.mt9@hotmail.com
                    </Text>
                  </Box>
                </Group>

                <Group>
                  <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                    <AtSign size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={500}>Instagram</Text>
                    <Text size="sm" c="dimmed">
                      @mt9.com.br
                    </Text>
                  </Box>
                </Group>

                <Group>
                  <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                    <Clock size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={500}>Horário de Funcionamento</Text>
                    <Text size="sm" c="dimmed">
                      Segunda a Sexta: 08h às 18h
                    </Text>
                  </Box>
                </Group>
              </Stack>
            </Card>

            <Card withBorder p="lg" radius="md" shadow="sm" mt="md">
              <Title order={3} size="h4" mb="md">
                Redes Sociais
              </Title>
              <Button
                variant="light"
                color="blue"
                leftSection={<ExternalLink size={16} />}
                component="a"
                href="https://instagram.com/mt9.com.br"
                target="_blank"
                fullWidth
              >
                Siga-nos no Instagram
              </Button>
            </Card>
          </Stack>
        </SimpleGrid>
      </Paper>

      {/* Sobre Nosso Portal Digital */}
      <Box mt={60}>
        <Title
          order={2}
          ta="center"
          mb={20}
          style={{
            position: "relative",
            display: "inline-block",
            left: "50%",
            transform: "translateX(-50%)",
            paddingBottom: "10px",
          }}
        >
          Nosso Portal Digital
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: "10%",
              width: "80%",
              height: "4px",
              background:
                "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(34,139,230,1) 50%, rgba(0,0,0,0) 100%)",
            }}
          />
        </Title>

        <Text ta="center" c="dimmed" mb={40}>
          Somos um jornal 100% digital, comprometido em trazer informação de
          qualidade
        </Text>

        <Paper shadow="md" radius="lg" withBorder p="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Card withBorder shadow="sm" radius="md" p="lg">
              <Title order={3} size="h5" mb="md">
                Notícias em tempo real
              </Title>
              <Text>
                Levamos a informação até você, onde quer que esteja. Como um
                portal totalmente digital, conseguimos atualizar nossas notícias
                rapidamente e manter nossos leitores bem informados sobre tudo
                que acontece em Mato Grosso.
              </Text>
            </Card>

            <Card withBorder shadow="sm" radius="md" p="lg">
              <Title order={3} size="h5" mb="md">
                Alcance estadual
              </Title>
              <Text>
                Nossa cobertura abrange todo o estado do Mato Grosso. Mesmo sem
                um escritório físico, estamos conectados com fontes em diversas
                cidades para trazer as notícias mais relevantes de cada região.
              </Text>
            </Card>
          </SimpleGrid>
        </Paper>
      </Box>

      {/* Atendimento */}
      <Card
        withBorder
        radius="lg"
        shadow="sm"
        mt={60}
        mb={40}
        padding="xl"
        style={{ backgroundColor: "var(--mantine-color-blue-0)" }}
      >
        <Group mb="md">
          <ThemeIcon size="xl" radius="md" variant="filled" color="blue">
            <Headphones size={24} />
          </ThemeIcon>
          <Title order={2} size="h3">
            Atendimento ao Leitor
          </Title>
        </Group>

        <Text size="lg" mb="xl">
          Estamos sempre em busca de melhorar nosso conteúdo e serviços. Se você
          tem sugestões de pautas, correções ou quer compartilhar sua opinião
          sobre nosso trabalho, entre em contato conosco. Sua opinião é muito
          importante!
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Card withBorder radius="md" padding="md">
            <Group mb="xs" justify="center">
              <ThemeIcon color="blue" variant="light" size="lg" radius="xl">
                <MessageSquare size={24} />
              </ThemeIcon>
            </Group>
            <Text fw={700} ta="center">
              Sugestões de Pauta
            </Text>
            <Text size="sm" c="dimmed" ta="center" mt="xs">
              Envie sugestões para nossa equipe de reportagem
            </Text>
          </Card>

          <Card withBorder radius="md" padding="md">
            <Group mb="xs" justify="center">
              <ThemeIcon color="blue" variant="light" size="lg" radius="xl">
                <Building size={24} />
              </ThemeIcon>
            </Group>
            <Text fw={700} ta="center">
              Anuncie conosco
            </Text>
            <Text size="sm" c="dimmed" ta="center" mt="xs">
              Divulgue seu negócio para milhares de leitores
            </Text>
          </Card>

          <Card withBorder radius="md" padding="md">
            <Group mb="xs" justify="center">
              <ThemeIcon color="blue" variant="light" size="lg" radius="xl">
                <Phone size={24} />
              </ThemeIcon>
            </Group>
            <Text fw={700} ta="center">
              Suporte
            </Text>
            <Text size="sm" c="dimmed" ta="center" mt="xs">
              Precisa de ajuda? Nosso suporte está à disposição
            </Text>
          </Card>
        </SimpleGrid>
      </Card>

      {/* Perguntas Frequentes */}
      <Box mt={60} mb={40}>
        <Title
          order={2}
          ta="center"
          mb={50}
          style={{
            position: "relative",
            display: "inline-block",
            left: "50%",
            transform: "translateX(-50%)",
            paddingBottom: "10px",
          }}
        >
          Perguntas Frequentes
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: "10%",
              width: "80%",
              height: "4px",
              background:
                "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(34,139,230,1) 50%, rgba(0,0,0,0) 100%)",
            }}
          />
        </Title>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={3} size="h5" mb="md">
              Como enviar uma sugestão de pauta?
            </Title>
            <Text>
              Você pode enviar suas sugestões de pauta através do formulário de
              contato nesta página ou diretamente pelo email
              contato.mt9@hotmail.com. Nossa equipe avaliará todas as sugestões
              recebidas.
            </Text>
          </Card>

          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={3} size="h5" mb="md">
              Como anunciar no MT9 Notícias?
            </Title>
            <Text>
              Para anunciar em nosso portal, entre em contato com nossa equipe
              comercial pelo email contato.mt9@hotmail.com. Temos diversas
              opções de anúncios para atender às necessidades do seu negócio.
            </Text>
          </Card>

          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={3} size="h5" mb="md">
              Vocês divulgam vaquinhas solidárias e campanhas?
            </Title>
            <Text>
              Sim, o MT9 Notícias apoia a divulgação de vaquinhas solidárias,
              campanhas beneficentes, ações de ajuda comunitária, apoio e
              buscas. Entre em contato pelo email contato.mt9@hotmail.com para
              avaliarmos a divulgação da sua campanha.
            </Text>
          </Card>

          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={3} size="h5" mb="md">
              Como corrigir uma informação publicada?
            </Title>
            <Text>
              Se você identificou algum erro em nossas publicações, por favor,
              envie um email para contato.mt9@hotmail.com com o link da notícia
              e a informação correta. Analisaremos e faremos as devidas
              correções.
            </Text>
          </Card>
        </SimpleGrid>
      </Box>

      {/* Rodapé */}
      <Group mt="xl" justify="center">
        <Text size="xs">
          &copy;2025 - By{" "}
          <Text span c="blue">
            Studio DS - Tecnologias
          </Text>
        </Text>
      </Group>
    </Container>
  );
}
