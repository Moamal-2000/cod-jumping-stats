import PlayerPageFallback from "@/components/Pages/PlayerProfile/PlayerPageFallback/PlayerPageFallback";
import { getOpenGraphMetadata, METADATA, SITE_URL } from "@/data/metadata";

const title = "Player | JumpersHeaven";
const description = "View JumpersHeaven player details and statistics.";

export const metadata = {
  title,
  description,
  keywords: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/openGraph/og-image-player.webp`,
    imageAlt: "Jumpers Heaven Player",
  }),
};

const PlayerRoute = () => {
  return <PlayerPageFallback />;
};

export default PlayerRoute;
