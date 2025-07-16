export async function deleteAds(id: string) {
  try {
    const response = await fetch(`/api/admin/publicidades`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Falha ao deletar publicidade");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao deletar publicidade:", error);
    throw error;
  }
}
