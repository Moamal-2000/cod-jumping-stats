import FiltersSection from "@/components/Pages/Leaderboards/FiltersSection/FiltersSection";
import LeaderBoard from "@/components/Pages/Leaderboards/LeaderBoard/LeaderBoard";
import PlayerToolTip from "@/components/Pages/ServersPage/PlayerToolTip/PlayerToolTip";
import { getOpenGraphMetadata, METADATA, SITE_URL } from "@/data/metadata";
import { Suspense } from "react";

const title = "Leaderboards | JumpersHeaven";
const description =
  "View filtered JumpersHeaven leaderboards to compare top runs, rankings, and player performance across categories.";

export const metadata = {
  title,
  description,
  keywords: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/openGraph/og-image-leaderboards.webp`,
    imageAlt: "Jumpers Heaven Leaderboards",
  }),
};

const LeaderboardsPage = () => {
  return (
    <div className="container">
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <FiltersSection />
          <LeaderBoard />
        </Suspense>
        <PlayerToolTip />
      </main>
    </div>
  );
};

export default LeaderboardsPage;
