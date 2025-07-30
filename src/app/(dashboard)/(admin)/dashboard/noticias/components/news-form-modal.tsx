"use client";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, Tooltip } from "@mantine/core";
import { PlusIcon } from "lucide-react";
import NewsForm from "./news-form";

export default function NewsFormModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} size={"lg"} title="Nova notícia">
        <NewsForm />
      </Modal>

      <Tooltip label="Criar nova notícia">
        <Button onClick={open} leftSection={<PlusIcon size={14} />}>
          Nova notícia
        </Button>
      </Tooltip>
    </>
  );
}
