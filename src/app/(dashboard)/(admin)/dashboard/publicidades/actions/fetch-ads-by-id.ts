export async function fetchAdsById(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/admin/publicidades/${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar publicidade");
  }
  const data = await response.json();
  return data.ads;
}
