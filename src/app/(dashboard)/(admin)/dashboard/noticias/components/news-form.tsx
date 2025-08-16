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
  TagsInput,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { newsSchema, NewsCategories, News } from "@/lib/schemas/news-schema";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { notifications } from "@mantine/notifications";
import { createNews } from "@/app/actions/noticias/create-news";
import { TipTapEditor } from "@/app/components/tip-tap-editor";

export default function NewsForm() {
  const form = useForm<News>({
    initialValues: {
      title: "",
      subtitle: "",
      category: "Geral",
      content: "",
      tags: [],
      publisher: "Da Redação",
      publishedAt: new Date(),
      image: undefined as File | undefined, // Inicialmente sem imagem
      source: "",
      imageSource: "",
    },
    validate: zod4Resolver(newsSchema), // Validação usando o schema Zod
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
      await createNews(values);
      notifications.show({
        title: "Notícia criada com sucesso",
        message: "A notícia foi criada e publicada.",
        color: "green",
      });
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          title: "Erro ao criar notícia",
          message: error.message,
          color: "red",
        });
      } else {
        notifications.show({
          title: "Erro desconhecido",
          message:
            "Ocorreu um erro ao criar a notícia. Tente novamente mais tarde.",
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
            label="Título"
            placeholder="Digite o título da notícia"
            {...form.getInputProps("title")}
            key={form.key("title")}
            withAsterisk
            size="md"
          />
          <TextInput
            label="Subtítulo"
            placeholder="Digite o subtítulo"
            {...form.getInputProps("subtitle")}
            key={form.key("subtitle")}
            size="md"
          />
        </Group>
        <Group grow wrap="wrap" gap="md">
          <Select
            withAsterisk
            label="Categoria"
            placeholder="Selecione uma categoria"
            key={form.key("category")}
            data={NewsCategories}
            {...form.getInputProps("category")}
            size="md"
          />
          <DateInput
            key={form.key("publishedAt")}
            withAsterisk
            label="Data da Publicação"
            placeholder="Selecione a data"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("publishedAt")}
            size="md"
          />
        </Group>
        <Stack gap="xs">
          <Text fw={500} size="sm" style={{ marginBottom: -8 }}>
            Conteúdo{" "}
            <span style={{ color: "var(--mantine-color-red-6)" }}>*</span>
          </Text>
          <TipTapEditor
            value={form.values.content}
            onChange={(value) => form.setFieldValue("content", value)}
          />
        </Stack>
        <TagsInput
          clearable
          key={form.key("tags")}
          label="Adicione palavras-chave"
          placeholder="Palavras-chave"
          withAsterisk
          {...form.getInputProps("tags")}
          size="md"
        />
        <TextInput
          withAsterisk
          key={form.key("publisher")}
          label="Publicador"
          placeholder="Quem publicou?"
          {...form.getInputProps("publisher")}
          size="md"
        />
        <TextInput
          key={form.key("source")}
          label="Fonte"
          placeholder="Digite a fonte da notícia (opcional)"
          {...form.getInputProps("source")}
          size="md"
        />
        <TextInput
          key={form.key("imageSource")}
          label="Fonte da Imagem"
          placeholder="Digite a fonte da imagem (opcional)"
          {...form.getInputProps("imageSource")}
          size="md"
        />
        <FileInput
          withAsterisk
          key={form.key("image")}
          label="Imagem"
          placeholder="Selecione uma imagem"
          accept="image/jpg,image/jpeg,image/png,image/webp"
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
