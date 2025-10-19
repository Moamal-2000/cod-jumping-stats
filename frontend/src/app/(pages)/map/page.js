import MapDetailPage from "@/Components/Pages/MapDetail/MapDetailPage";
import { Suspense } from "react";

async function MapPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MapDetailPage />
    </Suspense>
  );
}

export default MapPage;
