import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Select,
  Textarea,
  FileInput,
  Button,
  Image,
  Stack,
  Group,
  TagsInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import NewsFormSubmit from "../actions/news-form-submit";

export default function NewsForm() {
  const form = useForm({
    initialValues: {
      title: "",
      subtitle: "",
      category: "Geral",
      content: "",
      tags: [] as string[],
      publisher: "Da Redação",
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
      image: (file) => {
        if (!file) return "A imagem é obrigatória";
        if (file.size > 5 * 1024 * 1024)
          // 5MB em bytes
          return "A imagem não pode ser maior que 5MB";
        return null;
      },
      publicationDate: (date) =>
        !date ? "Selecione a data da publicação" : null,
    },
  });

  // Para preview da imagem
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Controla a mudança para gerar o preview
  function handleImageChange(file: File | null) {
    form.setFieldValue("image", file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  }

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("subtitle", values.subtitle);
        formData.append("category", values.category);
        formData.append("content", values.content);
        formData.append("tags", JSON.stringify(values.tags));
        formData.append("publisher", values.publisher);
        if (values.publicationDate) {
          // Garante que é um objeto Date e formata para yyyy-mm-dd
          const dateObj = new Date(values.publicationDate);
          dateObj.setUTCDate(dateObj.getUTCDate() + 1); // Ajusta para UTC
          const dateStr = dateObj.toISOString().slice(0, 10);
          formData.append("publicationDate", dateStr);
        }
        if (values.image) {
          formData.append("image", values.image);
        }
        await NewsFormSubmit(formData);
        form.reset(); // Reseta o formulário após o envio
        setImageUrl(null); // Limpa o preview da imagem
      })}
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
            required
            withAsterisk
            size="md"
          />
          <TextInput
            label="Subtítulo"
            placeholder="Digite o subtítulo"
            {...form.getInputProps("subtitle")}
            required
            withAsterisk
            size="md"
          />
        </Group>
        <Group grow wrap="wrap" gap="md">
          <Select
            required
            withAsterisk
            label="Categoria"
            data={["Geral", "Política", "Esportes", "Cultura", "Tecnologia"]}
            {...form.getInputProps("category")}
            size="md"
          />
          <DateInput
            required
            withAsterisk
            label="Data da Publicação"
            placeholder="Selecione a data"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("publicationDate")}
            size="md"
          />
        </Group>
        <Textarea
          required
          withAsterisk
          label="Conteúdo"
          placeholder="Escreva o conteúdo da notícia"
          minRows={5}
          autosize
          size="md"
          {...form.getInputProps("content")}
        />
        <TagsInput
          clearable
          label="Adicione palavras-chave"
          placeholder="Palavras-chave"
          {...form.getInputProps("tags")}
          size="md"
        />
        <TextInput
          required
          withAsterisk
          label="Publicador"
          placeholder="Quem publicou?"
          {...form.getInputProps("publisher")}
          size="md"
        />
        <FileInput
          required
          withAsterisk
          label="Imagem"
          placeholder="Selecione uma imagem"
          accept="image/*"
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
