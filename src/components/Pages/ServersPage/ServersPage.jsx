"use client";

import {
  SERVER_STATUS_FILTER,
  SERVERS_GAME_FILTER_OPTIONS,
  SERVERS_REFRESH_OPTIONS,
  SERVERS_VIEW_MODE,
} from "@/data/constants";
import { createQueryString, removeQueryString } from "@/functions/utils";
import { useGetServersQuery } from "@/redux/features/servers/api/serversSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AllServers from "./AllServers/AllServers";
import PlayerToolTip from "./PlayerToolTip/PlayerToolTip";
import ServersControls from "./ServersControls/ServersControls";

const ServersPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const refreshParam = Number(searchParams.get("refresh"));
  const autoRefreshParam = searchParams.get("auto-refresh");
  const gameParam = searchParams.get("game");
  const viewParam = searchParams.get("view");
  const statusParam = searchParams.get("status");

  const defaultRefreshSeconds = 30;
  const defaultGameFilter = "all";
  const defaultViewMode = "grid";
  const defaultStatusFilter = "all";

  const refreshSeconds = SERVERS_REFRESH_OPTIONS.includes(refreshParam)
    ? refreshParam
    : defaultRefreshSeconds;
  const autoRefreshEnabled =
    autoRefreshParam === null ? true : autoRefreshParam !== "false";
  const gameFilter = SERVERS_GAME_FILTER_OPTIONS.some(
    (option) => option.id === gameParam,
  )
    ? gameParam
    : defaultGameFilter;
  const viewMode = SERVERS_VIEW_MODE.some((option) => option.id === viewParam)
    ? viewParam
    : defaultViewMode;
  const statusFilter = SERVER_STATUS_FILTER.some(
    (option) => option.id === statusParam,
  )
    ? statusParam
    : defaultStatusFilter;

  const { data, isLoading, isError } = useGetServersQuery(undefined, {
    pollingInterval: autoRefreshEnabled ? refreshSeconds * 1000 : 0,
  });

  function handleRefreshSecondsChange(value) {
    if (value === defaultRefreshSeconds) {
      removeQueryString("refresh", searchParams, router, pathname);
      return;
    }

    createQueryString("refresh", value, searchParams, router, pathname);
  }

  function handleAutoRefreshEnabledChange(enabled) {
    if (enabled) {
      removeQueryString("auto-refresh", searchParams, router, pathname);
      return;
    }

    createQueryString("auto-refresh", false, searchParams, router, pathname);
  }

  function handleGameFilterChange(value) {
    if (value === defaultGameFilter) {
      removeQueryString("game", searchParams, router, pathname);
      return;
    }

    createQueryString("game", value, searchParams, router, pathname);
  }

  function handleViewModeChange(value) {
    if (value === defaultViewMode) {
      removeQueryString("view", searchParams, router, pathname);
      return;
    }

    createQueryString("view", value, searchParams, router, pathname);
  }

  function handleStatusFilterChange(value) {
    if (value === defaultStatusFilter) {
      removeQueryString("status", searchParams, router, pathname);
      return;
    }

    createQueryString("status", value, searchParams, router, pathname);
  }

  return (
    <>
      <ServersControls
        refreshSeconds={refreshSeconds}
        onRefreshSecondsChange={handleRefreshSecondsChange}
        autoRefreshEnabled={autoRefreshEnabled}
        onAutoRefreshEnabledChange={handleAutoRefreshEnabledChange}
        gameFilter={gameFilter}
        onGameFilterChange={handleGameFilterChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
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
