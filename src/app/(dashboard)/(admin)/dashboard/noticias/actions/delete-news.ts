export async function deleteNews(id: string) {
  try {
    const response = await fetch(`/api/admin/noticias`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Falha ao deletar notícia");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao deletar notícia:", error);
    throw error;
  }
}
