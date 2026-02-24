import MapDetailPage from "@/components/Pages/MapDetail/MapDetailPage";

async function MapPage({ params }) {
  const { cpId } = await params;

  return <MapDetailPage cpId={cpId} />;
}

export default MapPage;
