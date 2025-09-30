import MapDetailPage from "@/Components/Pages/MapDetail/MapDetailPage";

async function MapPage({ params }) {
  const { cpid } = await params;
  return <MapDetailPage cpid={cpid} />;
}

export default MapPage;
