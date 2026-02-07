"use client";

import { useState } from "react";
import { useGetServersQuery } from "@/redux/features/servers/api/serversSlice";
import AllServers from "./AllServers/AllServers";
import PlayerToolTip from "./PlayerToolTip/PlayerToolTip";
import ServersControls from "./ServersControls/ServersControls";

const ServersPage = () => {
  const [refreshSeconds, setRefreshSeconds] = useState(30);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [gameFilter, setGameFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError } = useGetServersQuery(undefined, {
    pollingInterval: autoRefreshEnabled ? refreshSeconds * 1000 : 0,
  });

  return (
    <>
      <ServersControls
        refreshSeconds={refreshSeconds}
        onRefreshSecondsChange={setRefreshSeconds}
        autoRefreshEnabled={autoRefreshEnabled}
        onAutoRefreshEnabledChange={setAutoRefreshEnabled}
        gameFilter={gameFilter}
        onGameFilterChange={setGameFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <AllServers
        servers={data?.Servers}
        loading={isLoading}
        error={isError}
        gameFilter={gameFilter}
        viewMode={viewMode}
        statusFilter={statusFilter}
      />
      <PlayerToolTip />
    </>
  );
};

export default ServersPage;
