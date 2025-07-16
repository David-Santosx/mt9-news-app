export async function fetchNewsById(id: string) {
  try {
    const response = await fetch(`/api/admin/noticias/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar notícia");
    }

    const data = await response.json();
    return data.news;
  } catch (error) {
    console.error("Erro ao buscar notícia:", error);
    throw error;
  }
}
