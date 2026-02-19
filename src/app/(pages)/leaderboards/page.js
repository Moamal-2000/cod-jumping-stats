import FiltersSection from "@/components/Pages/Leaderboards/FiltersSection/FiltersSection";
import LeaderBoard from "@/components/Pages/Leaderboards/LeaderBoard/LeaderBoard";
import PlayerToolTip from "@/components/Pages/ServersPage/PlayerToolTip/PlayerToolTip";
import { Suspense } from "react";

export const metadata = {
  title: "Leaderboards | JumpersHeaven",
  description:
    "View filtered JumpersHeaven leaderboards to compare top runs, rankings, and player performance across categories.",
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
