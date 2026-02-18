"use client";

import { useSearchParams } from "next/navigation";
import LeaderboardRanks from "./PlayerProfileLayout/Panels/LeaderboardRanks/LeaderboardRanks";
import PlayerOverview from "./PlayerProfileLayout/Panels/PlayerOverview/PlayerOverview";
import PlayerRouteCompletion from "./PlayerProfileLayout/Panels/PlayerRouteCompletion/PlayerRouteCompletion";
import RunAnalytics from "./PlayerProfileLayout/Panels/RunAnalytics/RunAnalytics";
import TopRuns from "./PlayerProfileLayout/Panels/TopRuns/TopRuns";

const PlayerProfilePanels = ({ playerId }) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const panelsObj = panels(playerId);
  const activePanel = panelsObj[activeTab] || panelsObj.overview;

  return activePanel;
};

export default PlayerProfilePanels;

const panels = (playerId) => ({
  overview: <PlayerOverview />,
  tops: <TopRuns playerId={playerId} />,
  leaderboards: <LeaderboardRanks />,
  routes: <PlayerRouteCompletion playerId={playerId} />,
  "runs-analytics": <RunAnalytics playerId={playerId} />,
});
