"use client";

import { useSearchParams } from "next/navigation";
import LeaderboardRanks from "./LeaderboardRanks/LeaderboardRanks";
import PlayerOverview from "./PlayerOverview/PlayerOverview";
import PlayerRouteCompletion from "./PlayerRouteCompletion/PlayerRouteCompletion";
import RunAnalytics from "./RunAnalytics/RunAnalytics";
import TopRuns from "./TopRuns/TopRuns";

const panels = (playerId) => ({
  overview: <PlayerOverview playerId={playerId} />,
  tops: <TopRuns playerId={playerId} />,
  leaderboards: <LeaderboardRanks playerId={playerId} />,
  routes: <PlayerRouteCompletion playerId={playerId} />,
  "runs-analytics": <RunAnalytics playerId={playerId} />,
});

const PlayerProfilePanels = ({ playerId }) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const panelsObj = panels(playerId);
  const activePanel = panelsObj[activeTab] || panelsObj.overview;

  return activePanel;
};

export default PlayerProfilePanels;
