"use client";

import { useSearchParams } from "next/navigation";
import LeaderboardRanks from "./PlayerProfileLayout/Panels/LeaderboardRanks/LeaderboardRanks";
import PlayerCompletionByFps from "./PlayerProfileLayout/Panels/PlayerCompletionByFps/PlayerCompletionByFps";
import PlayerOverview from "./PlayerProfileLayout/Panels/PlayerOverview/PlayerOverview";
import PlayerRouteCompletion from "./PlayerProfileLayout/Panels/PlayerRouteCompletion/PlayerRouteCompletion";
import RunAnalytics from "./PlayerProfileLayout/Panels/RunAnalytics/RunAnalytics";
import TopRuns from "./PlayerProfileLayout/Panels/TopRuns/TopRuns";

const PlayerProfilePanels = ({ playerId }) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const tabKey = activeTab in PANEL_COMPONENTS ? activeTab : "overview";
  const ActivePanel = PANEL_COMPONENTS[tabKey];
  const props = PANELS_WITH_PLAYER_ID.has(tabKey) ? { playerId } : {};

  return <ActivePanel {...props} />;
};

export default PlayerProfilePanels;

const PANEL_COMPONENTS = {
  overview: PlayerOverview,
  tops: TopRuns,
  leaderboards: LeaderboardRanks,
  routes: PlayerRouteCompletion,
  "completion-by-fps": PlayerCompletionByFps,
  "runs-analytics": RunAnalytics,
};

const PANELS_WITH_PLAYER_ID = new Set([
  "tops",
  "routes",
  "completion-by-fps",
  "runs-analytics",
]);
