import React, { useState } from "react";
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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import AdsFormSubmit from "../actions/ads-form-submit";

export default function AdsForm() {
  const form = useForm({
    initialValues: {
      campaing: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      link: "",
      image: null as File | null,
      position: "" as "HEADER" | "HIGHLIGHT" | "",
    },

    validate: {
      campaing: (value) =>
        value.trim().length < 5
          ? "O nome da campanha deve ter pelo menos 5 caracteres"
          : null,
      image: (file) => {
        if (!file) return "A imagem é obrigatória";
        if (file.size > 5 * 1024 * 1024)
          // 5MB em bytes
          return "A imagem não pode ser maior que 5MB";
        return null;
      },
      startDate: (date) => (!date ? "Selecione a data de início" : null),
      endDate: (date) => (!date ? "Selecione a data de término" : null),
      link: (value) =>
        value.startsWith("http://") || value.startsWith("https://")
          ? null
          : "O link deve começar com http:// ou https://",
      position: (value) => (!value ? "Selecione a posição do anúncio" : null),
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
        formData.append("campaing", values.campaing);
        formData.append("link", values.link);
        formData.append("position", values.position);
        if (values.startDate) {
          // Garante que é um objeto Date e formata para yyyy-mm-dd
          const dateObj = new Date(values.startDate);
          dateObj.setUTCDate(dateObj.getUTCDate() + 1); // Ajusta para UTC
          const dateStr = dateObj.toISOString().slice(0, 10);
          formData.append("startDate", dateStr);
          }
          if (values.endDate) {
              const dateObj = new Date(values.endDate);
              dateObj.setUTCDate(dateObj.getUTCDate() + 1); // Ajusta para UTC
              const dateStr = dateObj.toISOString().slice(0, 10);
              formData.append("endDate", dateStr);
        }
        if (values.image) {
          formData.append("image", values.image);
        }
        await AdsFormSubmit(formData);
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
        <TextInput
          label="Nome da Campanha"
          placeholder="Digite o nome da campanha publicitária"
          {...form.getInputProps("campaing")}
          required
          withAsterisk
          size="md"
        />
        <Group grow wrap="wrap" gap="md">
          <DateInput
            required
            withAsterisk
            label="Data de Início"
            placeholder="Selecione a data inicial"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("startDate")}
            size="md"
            clearable={false}
          />
          <DateInput
            required
            withAsterisk
            label="Data de Término"
            placeholder="Selecione a data final"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("endDate")}
            size="md"
            clearable={false}
            minDate={form.values.startDate || undefined}
          />
        </Group>
        <TextInput
          required
          withAsterisk
          label="Link"
          placeholder="https://exemplo.com"
          {...form.getInputProps("link")}
          size="md"
        />
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
            size="md"
          />
          <Text size="xs" c="dimmed" mt={4}>
            Certifique-se que a imagem tenha as dimensões corretas para a posição escolhida
          </Text>
        </Box>
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
