import { getOpenGraphMetadata, SITE_URL } from "@/data/metadata";
import { getMapByCpId } from "@/functions/utils";
import { size } from "./opengraph-image";

export const revalidate = 86400; // 1 day

export async function generateMetadata({ params }) {
  const { cpId } = await params;
  const map = await getMapByCpId(cpId);

  const mapName = map.Name;

  const title = `${mapName} Map | JumpersHeaven`;
  const description = `View JumpersHeaven map details and statistics for ${mapName}`;

  const generatedMetadata = {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    ...getOpenGraphMetadata({
      title,
      description,
      imageUrl: `${SITE_URL}/map/${cpId}/opengraph-image`,
      imageAlt: `Jumpers Heaven ${mapName} Map`,
      pagePath: `map/${cpId}`,
      imageType: "image/png",
      imageSize: size,
    }),
  };

  return generatedMetadata;
}

function MapLayout({ children }) {
  return children;
}

export default MapLayout;
