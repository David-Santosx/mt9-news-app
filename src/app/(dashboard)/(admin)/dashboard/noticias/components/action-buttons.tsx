"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { Edit, Trash } from "lucide-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { deleteNews } from "../actions/delete-news";

interface ActionButtonsProps {
  newsId: string;
  onEdit: (id: string) => void;
  onDelete: () => void;
}

export function ActionButtons({
  newsId,
  onEdit,
  onDelete,
}: ActionButtonsProps) {
  const handleDelete = async () => {
    modals.openConfirmModal({
      title: "Confirmar exclusão",
      children:
        "Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.",
      labels: { confirm: "Excluir", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteNews(newsId);
          notifications.show({
            title: "Sucesso",
            message: "Notícia excluída com sucesso",
            color: "green",
          });
          onDelete();
        } catch {
          notifications.show({
            title: "Erro",
            message: "Erro ao excluir notícia",
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Group gap="xs">
      <Tooltip label="Editar">
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={() => onEdit(newsId)}
        >
          <Edit size="1.125rem" />
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Excluir">
        <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
          <Trash size="1.125rem" />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
