export async function fetchNewsById(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/noticias/${id}`, {
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
