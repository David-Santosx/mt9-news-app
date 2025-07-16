import EditAdsForm from "../../components/edit-ads-form";

interface EditAdsPageProps {
  params: {
    id: string;
  };
}

export default function EditAdsPage({ params }: EditAdsPageProps) {
  return <EditAdsForm adsId={params.id} />;
}
