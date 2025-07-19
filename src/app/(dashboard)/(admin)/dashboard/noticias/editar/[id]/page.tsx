import EditNewsForm from "../../components/edit-news-form";
import type { Metadata } from "next";

interface EditNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: EditNewsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;

  return {
    title: `Editar Notícia #${id}`,
    description: `Editar notícia com ID ${id} no dashboard do MT9 Notícias`,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
    openGraph: {
      title: `Editar Notícia #${id} - Dashboard MT9 Notícias`,
      description: `Área de edição para a notícia ${id}`,
      type: "website",
    },
  };
}

export default async function EditNewsPage(props: EditNewsPageProps) {
  const params = await props.params;
  return <EditNewsForm newsId={params.id} />;
}
