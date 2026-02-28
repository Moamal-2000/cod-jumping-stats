import Favorites from "@/components/Pages/Favorites/Favorites/Favorites";
import { METADATA, SITE_URL } from "@/data/metadata";
import { getOpenGraphMetadata } from "@/lib/metadata";
import { Suspense } from "react";

const title = "Favorites | JumpersHeaven";
const description =
  "Access your saved JumpersHeaven players and maps in one place to quickly revisit the profiles and content you follow.";

export const metadata = {
  title,
  description,
  keywords: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/openGraph/og-image-favorites.webp`,
    imageAlt: "Jumpers Heaven Favorites",
  }),
};

const FavoritesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Favorites />
    </Suspense>
  );
};

export default FavoritesPage;
