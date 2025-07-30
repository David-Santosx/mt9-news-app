"use client";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, Tooltip } from "@mantine/core";
import { PlusIcon } from "lucide-react";
import AdsForm from "./ads-form";

export default function AdsFormModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size={"lg"}
        title="Nova Publicidade"
      >
        <AdsForm />
      </Modal>

      <Tooltip label="Criar nova publicidade">
        <Button onClick={open} leftSection={<PlusIcon size={14} />}>
          Nova publicidade
        </Button>
      </Tooltip>
    </>
  );
}
