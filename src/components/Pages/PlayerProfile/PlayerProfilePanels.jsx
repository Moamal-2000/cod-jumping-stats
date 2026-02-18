"use client";

import { useSearchParams } from "next/navigation";
import LeaderboardRanks from "./LeaderboardRanks/LeaderboardRanks";
import PlayerOverview from "./PlayerOverview/PlayerOverview";
import PlayerRouteCompletion from "./PlayerRouteCompletion/PlayerRouteCompletion";
import RunAnalytics from "./RunAnalytics/RunAnalytics";
import TopRuns from "./TopRuns/TopRuns";

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
