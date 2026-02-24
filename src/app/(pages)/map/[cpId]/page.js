import MapDetailPage from "@/components/Pages/MapDetail/MapDetailPage";

export const revalidate = 86400; // 1 day

async function MapPage({ params }) {
  const { cpId } = await params;

  return <MapDetailPage cpId={cpId} />;
}

export default MapPage;
