import EditAdsForm from "../../components/edit-ads-form";
import type { Metadata } from "next";

interface EditAdsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: EditAdsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;

  return {
    title: `Editar Publicidade #${id}`,
    description: `Editar publicidade com ID ${id} no dashboard do MT9 News`,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
    openGraph: {
      title: `Editar Publicidade #${id} - Dashboard MT9 News`,
      description: `Área de edição para a publicidade ${id}`,
      type: "website",
    },
  };
}

export default async function EditAdsPage(props: EditAdsPageProps) {
  const params = await props.params;
  return <EditAdsForm adsId={params.id} />;
}
