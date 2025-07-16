export async function fetchNews() {
  try {
    const response = await fetch("/api/admin/noticias", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar notícias");
    }

    const data = await response.json();
    return data.news;
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    throw error;
  }
}
