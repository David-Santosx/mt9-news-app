"use client";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Select,
  FileInput,
  Button,
  Image,
  Stack,
  Group,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { notifications } from "@mantine/notifications";
import { adsSchema, Ads, AdPositionList } from "@/lib/schemas/ads-schema";
import { createAds } from "@/app/actions/publicidades/create-ads";

export default function AdsForm() {
  const form = useForm<Ads>({
    initialValues: {
      campaing: "",
      link: "",
      position: "HEADER",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Padrão para 30 dias após a data atual
      image: undefined as File | undefined, // Inicialmente sem imagem
    },
    validate: zod4Resolver(adsSchema), // Validação usando o schema Zod
    mode: "controlled",
  });

  // Para preview da imagem
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Controla a mudança para gerar o preview
  function handleImageChange(file: File | null) {
    if (file !== null) {
      form.setFieldValue("image", file ?? undefined);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  }

  // Função para lidar com o envio do formulário
  async function handleSubmit(values: typeof form.values) {
    try {
      await createAds(values);
      notifications.show({
        title: "Publicidade criada com sucesso",
        message: "A publicidade foi criada e publicada.",
        color: "green",
      });
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          title: "Erro ao criar publicidade",
          message: error.message,
          color: "red",
        });
      } else {
        notifications.show({
          title: "Erro desconhecido",
          message:
            "Ocorreu um erro ao criar a publicidade. Tente novamente mais tarde.",
          color: "red",
        });
      }
    }
  }

  return (
    <form
      onSubmit={form.onSubmit(async (values) => await handleSubmit(values))}
      style={{ width: "100%" }}
    >
      <Stack
        gap="md"
        maw={600}
        mx="auto"
        p={{ base: "xs", sm: "xl" }}
        style={{ width: "100%" }}
      >
        <Group grow wrap="wrap" gap="md">
          <TextInput
            label="Campanha"
            placeholder="Digite o nome da campanha"
            {...form.getInputProps("campaing")}
            key={form.key("campaing")}
            withAsterisk
            size="md"
          />
          <TextInput
            label="Link"
            placeholder="Digite o link da campanha"
            {...form.getInputProps("link")}
            key={form.key("link")}
            size="md"
          />
        </Group>
        <Group grow wrap="wrap" gap="md">
          <Select
            withAsterisk
            label="Posição"
            placeholder="Selecione uma posição"
            key={form.key("position")}
            data={AdPositionList}
            {...form.getInputProps("position")}
            size="md"
          />
          <DateInput
            key={form.key("startDate")}
            withAsterisk
            label="Data de Início"
            placeholder="Selecione a data"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("startDate")}
            size="md"
            clearable={false}
            firstDayOfWeek={0}
            locale="pt-BR"
            // Ensure the date is properly set at midnight to avoid timezone issues
            onChange={(newDate) => {
              if (newDate) {
                const date = new Date(newDate);
                date.setHours(0, 0, 0, 0);
                form.setFieldValue("publishedAt", date);
              }
            }}
          />
          <DateInput
            key={form.key("endDate")}
            withAsterisk
            label="Data de Término"
            placeholder="Selecione a data"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("endDate")}
            size="md"
            clearable={false}
            firstDayOfWeek={0}
            locale="pt-BR"
            // Ensure the date is properly set at midnight to avoid timezone issues
            onChange={(newDate) => {
              if (newDate) {
                const date = new Date(newDate);
                date.setHours(0, 0, 0, 0);
                form.setFieldValue("publishedAt", date);
              }
            }}
          />
        </Group>

        <FileInput
          withAsterisk
          key={form.key("image")}
          label="Imagem"
          placeholder="Selecione uma imagem"
          accept="image/jpg,image/jpeg,image/png,image/webp,image/gif"
          value={form.values.image}
          onChange={handleImageChange}
          clearable
          size="md"
        />
        {imageUrl && (
          <Group justify="center" mt="sm">
            <Image
              src={imageUrl}
              alt="Preview da imagem selecionada"
              height={180}
              fit="contain"
              radius="md"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            />
          </Group>
        )}

        <Group justify="flex-end" mt="md" gap="md">
          <Button
            loading={form.submitting}
            type="submit"
            size="md"
            radius="md"
            style={{ minWidth: 120 }}
          >
            Enviar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
