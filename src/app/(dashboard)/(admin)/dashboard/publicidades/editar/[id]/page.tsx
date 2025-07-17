import EditAdsForm from "../../components/edit-ads-form";
import type { Metadata } from "next";

interface EditAdsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EditAdsPageProps): Promise<Metadata> {
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

export default function EditAdsPage({ params }: EditAdsPageProps) {
  return <EditAdsForm adsId={params.id} />;
}
