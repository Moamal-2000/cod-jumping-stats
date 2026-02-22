import PlayersPage from "@/components/Pages/PlayersPage/PlayersPage";
import PlayerToolTip from "@/components/Pages/ServersPage/PlayerToolTip/PlayerToolTip";
import { getOpenGraphMetadata, METADATA, SITE_URL } from "@/data/metadata";
import { Suspense } from "react";

const title = "Players | JumpersHeaven";
const description =
  "Explore JumpersHeaven players, compare profile stats, and find players by performance and activity.";

export const metadata = {
  title,
  description,
  keyword: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/og-image-players.webp`,
    imageAlt: "Jumpers Heaven Players",
  }),
};

const Page = () => {
  return (
    <div className="container">
      <main>
        <Suspense>
          <PlayersPage />
        </Suspense>
        <PlayerToolTip />
      </main>
    </div>
  );
};

export default Page;
