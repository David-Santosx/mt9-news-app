"use client";

import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Select,
  Textarea,
  FileInput,
  Button,
  Stack,
  Group,
  TagsInput,
  Paper,
  Title,
  Container,
  Skeleton,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { fetchNewsById } from "../actions/fetch-news-by-id";
import { updateNews } from "../actions/update-news";

interface EditNewsFormProps {
  newsId: string;
}

export default function EditNewsForm({ newsId }: EditNewsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    initialValues: {
      title: "",
      subtitle: "",
      category: "",
      content: "",
      tags: [] as string[],
      publisher: "",
      image: null as File | null,
      publicationDate: null as Date | null,
    },

    validate: {
      title: (value) =>
        value.trim().length < 5
          ? "O título deve ter pelo menos 5 caracteres"
          : null,
      subtitle: (value) =>
        value.trim().length === 0 ? "O subtítulo é obrigatório" : null,
      category: (value) => (!value ? "Selecione uma categoria" : null),
      content: (value) =>
        value.trim().length < 20
          ? "O conteúdo deve ter pelo menos 20 caracteres"
          : null,
      tags: (value) =>
        value.length === 0
          ? "Adicione pelo menos uma palavra-chave (tag)"
          : null,
      publisher: (value) =>
        value.trim().length < 3
          ? "O nome do publicador deve ter pelo menos 3 caracteres"
          : null,
      publicationDate: (date) =>
        !date ? "Selecione a data da publicação" : null,
    },
  });

  useEffect(() => {
    async function loadNews() {
      try {
        const news = await fetchNewsById(newsId);
        form.setValues({
          title: news.title,
          subtitle: news.subtitle,
          category: news.category,
          content: news.content,
          tags: news.tags,
          publisher: news.publisher,
          publicationDate: new Date(news.publishedAt),
        });
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao carregar notícia",
          color: "red",
        });
        router.push("/dashboard/noticias");
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();
  }, [newsId, form, router]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("subtitle", values.subtitle);
      formData.append("category", values.category);
      formData.append("content", values.content);
      formData.append("tags", JSON.stringify(values.tags));
      formData.append("publisher", values.publisher);

      if (values.publicationDate) {
        // Assegura que a data está no fuso horário local
        const dateObj = new Date(values.publicationDate);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const day = dateObj.getDate();
        
        // Cria nova data com horário meio-dia UTC
        const utcDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
        formData.append("publicationDate", utcDate.toISOString());
      }

      if (values.image) {
        formData.append("image", values.image);
      }

      await updateNews(newsId, formData);

      notifications.show({
        title: "Sucesso",
        message: "Notícia atualizada com sucesso",
        color: "green",
      });

      router.push("/dashboard/noticias");
    } catch (error) {
      notifications.show({
        title: "Erro",
        message:
          error instanceof Error ? error.message : "Erro ao atualizar notícia",
        color: "red",
      });
    }
  };

  return (
    <Container size="md">
      <Paper shadow="xs" p="xl" radius="md">
        <Title order={2} mb="lg">
          Editar Notícia
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              {isLoading ? (
                <>
                  <Skeleton height={36} radius="sm" />
                  <Skeleton height={36} radius="sm" />
                </>
              ) : (
                <>
                  <TextInput
                    label="Título"
                    placeholder="Digite o título da notícia"
                    {...form.getInputProps("title")}
                    required
                    withAsterisk
                  />
                  <TextInput
                    label="Subtítulo"
                    placeholder="Digite o subtítulo"
                    {...form.getInputProps("subtitle")}
                    required
                    withAsterisk
                  />
                </>
              )}
            </Group>

            <Group grow>
              {isLoading ? (
                <>
                  <Skeleton height={36} radius="sm" />
                  <Skeleton height={36} radius="sm" />
                </>
              ) : (
                <>
                  <Select
                    required
                    withAsterisk
                    label="Categoria"
                    data={[
                      "Geral",
                      "Política",
                      "Esportes",
                      "Cultura",
                      "Tecnologia",
                    ]}
                    {...form.getInputProps("category")}
                  />
                  <DateInput
                    required
                    withAsterisk
                    label="Data da Publicação"
                    placeholder="Selecione a data"
                    valueFormat="DD/MM/YYYY"
                    {...form.getInputProps("publicationDate")}
                    clearable={false}
                  />
                </>
              )}
            </Group>

            {isLoading ? (
              <Skeleton height={120} radius="sm" />
            ) : (
              <Textarea
                required
                withAsterisk
                label="Conteúdo"
                placeholder="Escreva o conteúdo da notícia"
                minRows={5}
                autosize
                {...form.getInputProps("content")}
              />
            )}

            {isLoading ? (
              <Skeleton height={36} radius="sm" />
            ) : (
              <TagsInput
                clearable
                label="Palavras-chave"
                placeholder="Adicione palavras-chave"
                {...form.getInputProps("tags")}
              />
            )}

            {isLoading ? (
              <Skeleton height={36} radius="sm" />
            ) : (
              <TextInput
                required
                withAsterisk
                label="Publicador"
                placeholder="Quem publicou?"
                {...form.getInputProps("publisher")}
              />
            )}

            {isLoading ? (
              <Skeleton height={36} radius="sm" />
            ) : (
              <FileInput
                label="Nova Imagem"
                placeholder="Selecione uma nova imagem"
                accept="image/*"
                {...form.getInputProps("image")}
                clearable
              />
            )}

            <Group justify="flex-end" mt="xl">
              <Button
                variant="subtle"
                onClick={() => router.push("/dashboard/noticias")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={form.submitting} disabled={isLoading}>
                Salvar Alterações
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
