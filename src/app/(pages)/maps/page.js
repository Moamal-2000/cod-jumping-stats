import MapsPage from "@/components/Pages/Maps/MapsPage/MapsPage";
import { getOpenGraphMetadata, METADATA, SITE_URL } from "@/data/metadata";

const title = "Maps | JumpersHeaven";
const description =
  "Discover JumpersHeaven maps with searchable listings, map details, and route-related information for tracking progress.";

export const metadata = {
  title,
  description,
  keyword: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/og-image-maps.webp`,
    imageAlt: "Jumpers Heaven Maps",
  }),
};

const CoreMapsPage = () => {
  return <MapsPage />;
};

export default CoreMapsPage;
