"use client";

import PlayerInfo from "./PlayerInfo/PlayerInfo";
import PlayerProgress from "./PlayerProgress/PlayerProgress";
import RecentActivity from "./RecentActivity/RecentActivity";
import TopRunsPerFps from "./TopRunsPerFps/TopRunsPerFps";

const PlayerOverview = () => {
  return (
    <>
      <PlayerInfo />
      <TopRunsPerFps />
      <PlayerProgress />
      <RecentActivity />
    </>
  );
};

export default PlayerOverview;
