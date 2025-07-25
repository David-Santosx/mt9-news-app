export async function updateNews(id: string, formData: FormData) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/noticias/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Erro ao atualizar notícia");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);
    throw error;
  }
}
