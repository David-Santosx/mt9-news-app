"use client";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal } from "@mantine/core";
import { PlusIcon } from "lucide-react";
import AdsForm from "./ads-form";

export default function AdsFormModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Nova Publicidade">
        <AdsForm />
      </Modal>

      <Button onClick={open} rightSection={<PlusIcon size={18} />}>
        Nova Publicidade
      </Button>
    </>
  );
}
