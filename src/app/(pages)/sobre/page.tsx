'use client';

import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Box,
  Badge,
  List,
  ThemeIcon,
  Timeline,
  Flex,
  Divider,
  Card
} from '@mantine/core';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  Megaphone,
  MessageSquare,
  Target,
  Users,
  Newspaper
} from 'lucide-react';
import Image from 'next/image';
import Script from 'next/script';

export default function Page() {
  return (
    <>
      <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1306875437034957" crossOrigin="anonymous" />
      <Container size="xl" py="xl">
        {/* Cabeçalho */}
        <Box
          style={{
            position: 'relative',
            backgroundImage: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            backgroundSize: 'cover',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            style={{
              padding: '5rem 2rem',
              textAlign: 'center',
            }}
          >
            <Box
              style={{
                backgroundColor: 'white',
                borderRadius: '50%',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                marginBottom: '1.5rem',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '200px',
                height: '200px',
              }}
            >
              <Image
                src="/images/mt9-logo.svg"
                width={160}
                height={90}
                alt="MT9 Notícias e Comércios"
                style={{ objectFit: 'contain' }}
              />
            </Box>
            <Title
              order={1}
              c="white"
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                textShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
                marginBottom: '1.2rem',
                letterSpacing: '0.5px'
              }}
            >
              Conheça o MT9 Notícias & Comércios
            </Title>
            <Text
              c="white"
              size="xl"
              style={{
                maxWidth: '800px',
                fontWeight: 500,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                letterSpacing: '0.3px',
              }}
            >
              Sua fonte confiável de informações sobre o Mato Grosso
            </Text>
          </Flex>
        </Box>

        {/* Missão, Visão e Valores */}
        <Paper
          shadow="md"
          radius="lg"
          withBorder
          p="xl"
          style={{
            marginTop: '-2rem',
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'white',
          }}
        >
          <Stack gap="xl">
            <Box>
              <Group mb="md">
                <ThemeIcon
                  size="xl"
                  radius="md"
                  variant="light"
                  color="blue"
                >
                  <Target size={24} />
                </ThemeIcon>
                <Title order={2} size="h3">Nossa Missão</Title>
              </Group>
              <Text size="lg">
                Atualizar com confiança as informações que acontecem no estado do Mato Grosso,
                trazendo notícias relevantes e conteúdo de qualidade para toda a comunidade.
              </Text>
            </Box>

            <Divider />

            <Box>
              <Group mb="md">
                <ThemeIcon
                  size="xl"
                  radius="md"
                  variant="light"
                  color="blue"
                >
                  <Eye size={24} />
                </ThemeIcon>
                <Title order={2} size="h3">Nossa Visão</Title>
              </Group>
              <Text size="lg">
                Ser a voz da comunidade mato-grossense, com foco em pequenos e grandes comerciantes,
                fornecendo um canal para divulgação de notícias e informações relevantes para o desenvolvimento regional.
              </Text>
            </Box>

            <Divider />

            <Box>
              <Group mb="md">
                <ThemeIcon
                  size="xl"
                  radius="md"
                  variant="light"
                  color="blue"
                >
                  <Heart size={24} />
                </ThemeIcon>
                <Title order={2} size="h3">Nossos Valores</Title>
              </Group>
              <List
                spacing="sm"
                size="lg"
                center
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <CheckCircle2 size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <Text fw={500}>Informação clara e direta</Text> -
                  <Text span c="dimmed" ml={5}>
                    Buscamos a comunicação simples e direta com quem quer se informar.
                  </Text>
                </List.Item>

                <List.Item>
                  <Text fw={500}>Clareza e honestidade</Text> -
                  <Text span c="dimmed" ml={5}>
                    Comprometidos com a transmissão transparente dos fatos.
                  </Text>
                </List.Item>

                <List.Item>
                  <Text fw={500}>Proximidade com a comunidade</Text> -
                  <Text span c="dimmed" ml={5}>
                    Valorizamos as histórias e necessidades dos cidadãos mato-grossenses.
                  </Text>
                </List.Item>

                <List.Item>
                  <Text fw={500}>Confiança e integridade</Text> -
                  <Text span c="dimmed" ml={5}>
                    Fundamentos que norteiam todas as nossas ações e publicações.
                  </Text>
                </List.Item>
              </List>
            </Box>
          </Stack>
        </Paper>

        {/* Nossa História */}
        <Box mt={60} mb={40}>
          <Title
            order={2}
            ta="center"
            mb={50}
            style={{
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)',
              paddingBottom: '10px',
            }}
          >
            Nossa História
            <Box
              style={{
                position: 'absolute',
                bottom: 0,
                left: '10%',
                width: '80%',
                height: '4px',
                background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(34,139,230,1) 50%, rgba(0,0,0,0) 100%)',
              }}
            />
          </Title>

          <Timeline active={3} bulletSize={24} lineWidth={2}>
            <Timeline.Item
              bullet={<Calendar size={12} />}
              title="Fundação"
              lineVariant="dashed"
            >
              <Text c="dimmed" size="sm">Dezembro de 2024</Text>
              <Text size="md" mt={4}>
                O MT9 Notícias & Comércios foi fundado com a missão de trazer informações relevantes
                sobre o estado do Mato Grosso para todos os cidadãos.
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<Newspaper size={12} />}
              title="Desenvolvimento"
              lineVariant="dashed"
            >
              <Text c="dimmed" size="sm">Fevereiro de 2025</Text>
              <Text size="md" mt={4}>
                Início do desenvolvimento da plataforma digital, com foco em acessibilidade
                e facilidade de uso para todos os públicos.
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<Megaphone size={12} />}
              title="Lançamento Oficial"
            >
              <Text c="dimmed" size="sm">Março de 2025</Text>
              <Text size="md" mt={4}>
                Lançamento oficial do portal de notícias, com cobertura especial dos principais
                eventos do estado e parcerias com comerciantes locais.
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<Users size={12} />}
              title="Renovação da Marca"
              color="blue"
            >
              <Text c="dimmed" size="sm">Julho de 2025</Text>
              <Text size="md" mt={4}>
                Renovação completa da identidade visual e expansão dos serviços oferecidos,
                com foco em maior integração com a comunidade local.
              </Text>
              <Badge color="blue" variant="light" size="sm" mt={8}>Atual</Badge>
            </Timeline.Item>
          </Timeline>
        </Box>

        {/* Nosso Compromisso */}
        <Card
          withBorder
          radius="lg"
          shadow="sm"
          mt={60}
          mb={40}
          padding="xl"
          style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}
        >
          <Group mb="md">
            <ThemeIcon
              size="xl"
              radius="md"
              variant="filled"
              color="blue"
            >
              <MessageSquare size={24} />
            </ThemeIcon>
            <Title order={2} size="h3">Nosso Compromisso</Title>
          </Group>

          <Text size="lg" mb="xl">
            No MT9 Notícias & Comércios, estamos comprometidos em fornecer informações precisas,
            relevantes e atualizadas sobre os acontecimentos no Mato Grosso. Acreditamos no poder do
            jornalismo local para fortalecer comunidades e apoiar o desenvolvimento regional.
          </Text>

          <Group grow>
            <Card withBorder radius="md" padding="md">
              <Group mb="xs">
                <ThemeIcon color="blue" variant="light" size="md" radius="xl">
                  <Clock size={16} />
                </ThemeIcon>
                <Text fw={700}>Notícias em tempo real</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Acompanhamos os eventos mais importantes e trazemos as notícias mais recentes para você.
              </Text>
            </Card>

            <Card withBorder radius="md" padding="md">
              <Group mb="xs">
                <ThemeIcon color="blue" variant="light" size="md" radius="xl">
                  <Users size={16} />
                </ThemeIcon>
                <Text fw={700}>Foco na comunidade</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Valorizamos as histórias e as vozes das pessoas que fazem a diferença em nosso estado.
              </Text>
            </Card>
          </Group>
        </Card>

        {/* Rodapé */}
        <Group mt="xl" justify="center">
          <Text size="xs">
            &copy;2025 - By <Text span c="blue">Studio DS - Tecnologias</Text>
          </Text>
        </Group>
      </Container>
    </>
  );
}