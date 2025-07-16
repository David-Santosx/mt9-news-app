import EditNewsForm from "../../components/edit-news-form";

interface EditNewsPageProps {
  params: {
    id: string;
  };
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  return <EditNewsForm newsId={params.id} />;
}
