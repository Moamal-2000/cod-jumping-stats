"use client";

import PlayerInfo from "./PlayerInfo/PlayerInfo";
import RecentActivity from "./RecentActivity/RecentActivity";
import TopRunsPerFps from "./TopRunsPerFps/TopRunsPerFps";

const PlayerOverview = () => {
  return (
    <>
      <PlayerInfo />
      <TopRunsPerFps />
      <RecentActivity />
    </>
  );
};

export default PlayerOverview;
