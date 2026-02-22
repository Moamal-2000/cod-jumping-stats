import MapsPage from "@/components/Pages/Maps/MapsPage/MapsPage";
import { getOpenGraphMetadata, METADATA, SITE_URL } from "@/data/metadata";

const title = "Maps | JumpersHeaven";
const description =
  "Discover JumpersHeaven maps with searchable listings, map details, and route-related information for tracking progress.";

export const metadata = {
  title,
  description,
  keywords: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/openGraph/og-image-maps.webp`,
    imageAlt: "Jumpers Heaven Maps",
  }),
};

const CoreMapsPage = () => {
  return <MapsPage />;
};

export default CoreMapsPage;
