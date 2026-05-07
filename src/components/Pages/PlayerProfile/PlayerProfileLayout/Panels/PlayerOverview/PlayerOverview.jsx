"use client";

import PlayerInfo from "./PlayerInfo/PlayerInfo";
import RecentActivity from "./RecentActivity/RecentActivity";
import TopRunsPerFps from "./TopRunsPerFps/TopRunsPerFps";

const PlayerOverview = () => {
  return (
    <div id="player-profile-panel-overview">
      <PlayerInfo />
      <TopRunsPerFps />
      <RecentActivity />
    </div>
  );
};

export default PlayerOverview;
