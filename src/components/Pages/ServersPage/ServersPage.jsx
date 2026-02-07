"use client";

import { useState } from "react";
import { useGetServersQuery } from "@/redux/features/servers/api/serversSlice";
import AllServers from "./AllServers/AllServers";
import PlayerToolTip from "./PlayerToolTip/PlayerToolTip";
import ServersControls from "./ServersControls/ServersControls";

const ServersPage = () => {
  const [refreshSeconds, setRefreshSeconds] = useState(30);
  const [gameFilter, setGameFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const { data, isLoading, isError } = useGetServersQuery(undefined, {
    pollingInterval: refreshSeconds * 1000,
  });

  return (
    <main>
      <ServersControls
        refreshSeconds={refreshSeconds}
        onRefreshSecondsChange={setRefreshSeconds}
        gameFilter={gameFilter}
        onGameFilterChange={setGameFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <AllServers
        servers={data?.Servers}
        loading={isLoading}
        error={isError}
        gameFilter={gameFilter}
        viewMode={viewMode}
      />
      <PlayerToolTip />
    </main>
  );
};

export default ServersPage;
