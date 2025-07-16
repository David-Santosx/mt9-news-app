import { notifications } from "@mantine/notifications";

export default async function AdsFormSubmit(formData: FormData) {
  try {
    const response = await fetch("/api/admin/publicidades", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro na requisição");
    }
    notifications.show({
      title: "Sucesso",
      message: data.msg,
      color: "green",
    });
  } catch (error) {
    console.error("Erro ao criar publicidade:", error);
    notifications.show({
      title: "Erro",
      message: typeof error === "object" && error !== null && "message" in error ? (error as { message?: string }).message || "Erro desconhecido ao criar publicidade" : "Erro desconhecido ao criar publicidade",
      color: "red",
    });
  }
}
