"use client";

import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  FileInput,
  Button,
  Image,
  Stack,
  Group,
  Select,
  Text,
  Box,
  Paper,
  Title,
  Container,
  Skeleton,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { fetchAdsById } from "../actions/fetch-ads-by-id";
import { updateAds } from "../actions/update-ads";

interface EditAdsFormProps {
  adsId: string;
}

export default function EditAdsForm({ adsId }: EditAdsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      campaing: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      link: "",
      position: "" as "HEADER" | "HIGHLIGHT" | "",
      image: null as File | null,
    },

    validate: {
      campaing: (value) =>
        value.trim().length < 5
          ? "O nome da campanha deve ter pelo menos 5 caracteres"
          : null,
      link: (value) =>
        value.startsWith("http://") || value.startsWith("https://")
          ? null
          : "O link deve começar com http:// ou https://",
      position: (value) => (!value ? "Selecione a posição do anúncio" : null),
      startDate: (date) => (!date ? "Selecione a data de início" : null),
      endDate: (date) => (!date ? "Selecione a data de término" : null),
    },
  });

  useEffect(() => {
    async function loadAds() {
      try {
        const ads = await fetchAdsById(adsId);
        if (isLoading) {
          form.setValues({
            campaing: ads.campaing,
            link: ads.link || "",
            position: ads.position,
            startDate: new Date(ads.startDate),
            endDate: new Date(ads.endDate),
          });
        }
        setCurrentImage(ads.image || null);
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao carregar publicidade",
          color: "red",
        });
        router.push("/dashboard/publicidades");
      } finally {
        setIsLoading(false);
      }
    }

    loadAds();
  }, [adsId, form, isLoading, router]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const formData = new FormData();

      formData.append("campaing", values.campaing);
      formData.append("link", values.link);
      formData.append("position", values.position);

      if (values.startDate) {
        const startDate = new Date(values.startDate);
        startDate.setUTCHours(12);
        formData.append("startDate", startDate.toISOString());
      }

      if (values.endDate) {
        const endDate = new Date(values.endDate);
        endDate.setUTCHours(12);
        formData.append("endDate", endDate.toISOString());
      }

      if (values.image) {
        formData.append("image", values.image);
      }

      await updateAds(adsId, formData);

      notifications.show({
        title: "Sucesso",
        message: "Publicidade atualizada com sucesso",
        color: "green",
      });

      router.push("/dashboard/publicidades");
    } catch (error) {
      notifications.show({
        title: "Erro",
        message:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar publicidade",
        color: "red",
      });
    }
  };

  // Controla a mudança para gerar o preview
  function handleImageChange(file: File | null) {
    form.setFieldValue("image", file);
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentImage(url);
    }
  }

  return (
    <Container size="md">
      <Paper shadow="xs" p="xl" radius="md">
        <Title order={2} mb="lg">
          Editar Publicidade
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {isLoading ? (
              <Skeleton height={36} radius="sm" />
            ) : (
              <TextInput
                label="Nome da Campanha"
                placeholder="Digite o nome da campanha publicitária"
                {...form.getInputProps("campaing")}
                required
                withAsterisk
              />
            )}

            <Group grow>
              {isLoading ? (
                <>
                  <Skeleton height={36} radius="sm" />
                  <Skeleton height={36} radius="sm" />
                </>
              ) : (
                <>
                  <DateInput
                    required
                    withAsterisk
                    label="Data de Início"
                    placeholder="Selecione a data inicial"
                    valueFormat="DD/MM/YYYY"
                    {...form.getInputProps("startDate")}
                    clearable={false}
                  />
                  <DateInput
                    required
                    withAsterisk
                    label="Data de Término"
                    placeholder="Selecione a data final"
                    valueFormat="DD/MM/YYYY"
                    {...form.getInputProps("endDate")}
                    clearable={false}
                    minDate={form.values.startDate || undefined}
                  />
                </>
              )}
            </Group>

            {isLoading ? (
              <Skeleton height={36} radius="sm" />
            ) : (
              <TextInput
                required
                withAsterisk
                label="Link"
                placeholder="https://exemplo.com"
                {...form.getInputProps("link")}
              />
            )}

            {isLoading ? (
              <Skeleton height={36} radius="sm" />
            ) : (
              <Box>
                <Select
                  required
                  withAsterisk
                  label="Posição do Anúncio"
                  description="Escolha o local onde o anúncio será exibido"
                  placeholder="Selecione a posição"
                  data={[
                    { value: "HEADER", label: "Cabeçalho (728x90)" },
                    { value: "HIGHLIGHT", label: "Bloco Destaque (300x250)" },
                  ]}
                  {...form.getInputProps("position")}
                />
                <Text size="xs" c="dimmed" mt={4}>
                  Certifique-se que a imagem tenha as dimensões corretas para a
                  posição escolhida
                </Text>
              </Box>
            )}

            {isLoading ? (
              <Skeleton height={36} radius="sm" />
            ) : (
              <FileInput
                label="Nova Imagem"
                placeholder="Selecione uma nova imagem"
                accept="image/*"
                onChange={handleImageChange}
                clearable
              />
            )}

            {currentImage && (
              <Group justify="center" mt="sm">
                <Image
                  src={currentImage}
                  alt="Preview da imagem selecionada"
                  height={180}
                  fit="contain"
                  radius="md"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                />
              </Group>
            )}

            <Group justify="flex-end" mt="xl">
              <Button
                variant="subtle"
                onClick={() => router.push("/dashboard/publicidades")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={form.submitting}
                disabled={isLoading}
              >
                Salvar Alterações
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
