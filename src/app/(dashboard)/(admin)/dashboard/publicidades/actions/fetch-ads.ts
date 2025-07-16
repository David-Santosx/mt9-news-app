export async function fetchAds() {
  try {
    const response = await fetch("/api/admin/publicidades", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar publicidades");
    }

    const data = await response.json();
    return data.ads;
  } catch (error) {
    console.error("Erro ao buscar publicidades:", error);
    throw error;
  }
}
