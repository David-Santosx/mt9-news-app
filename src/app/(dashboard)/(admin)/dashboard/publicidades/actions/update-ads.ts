import { notifications } from "@mantine/notifications";

export async function updateAds(id: string, formData: FormData) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/publicidades/${id}`, {
      method: "PATCH",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao atualizar publicidade");
    }

    notifications.show({
      title: "Sucesso",
      message: data.msg,
      color: "green",
    });

    return data;
  } catch (error) {
    console.error("Erro ao atualizar publicidade:", error);
    notifications.show({
      title: "Erro",
      message:
        error instanceof Error ? error.message : "Erro ao atualizar publicidade",
      color: "red",
    });
    throw error;
  }
}
