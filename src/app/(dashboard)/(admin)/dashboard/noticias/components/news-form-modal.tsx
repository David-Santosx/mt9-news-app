"use client";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal } from "@mantine/core";
import { PlusIcon } from "lucide-react";
import NewsForm from "./news-form";

export default function NewsFormModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Nova notícia">
        <NewsForm />
      </Modal>

      <Button onClick={open} rightSection={<PlusIcon size={18} />}>
        Nova Notícia
      </Button>
    </>
  );
}
