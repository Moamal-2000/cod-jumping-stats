import MapDetailPage from "@/Components/Pages/MapDetail/MapDetailPage";
import { generateMapMetadata } from "@/Functions/utils";

export async function generateMetadata({ params }) {
  const { cpid } = await params;
  return generateMapMetadata({ cpid })
}

async function MapPage({ params }) {
  const { cpid } = await params;
  return <MapDetailPage cpid={cpid} />;
}

export default MapPage;
