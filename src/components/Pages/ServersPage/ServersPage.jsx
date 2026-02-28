"use client";

import {
  SERVER_STATUS_FILTER,
  SERVERS_GAME_FILTER_OPTIONS,
  SERVERS_REFRESH_OPTIONS,
  SERVERS_VIEW_MODE,
} from "@/data/constants";
import { createQueryString, removeQueryString } from "@/lib/utils";
import { useGetServersQuery } from "@/redux/features/servers/api/serversSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AllServers from "./AllServers/AllServers";
import PlayerToolTip from "./PlayerToolTip/PlayerToolTip";
import ServersControls from "./ServersControls/ServersControls";

const DEFAULT_REFRESH_SECONDS = 30;
const DEFAULT_GAME_FILTER = "cod2";
const DEFAULT_VIEW_MODE = "grid";
const DEFAULT_STATUS_SERVER = "all";
const DEFAULT_AUTO_REFRESH = "true";

const ServersPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const refreshParam = +searchParams.get("refresh") || DEFAULT_REFRESH_SECONDS;
  const autoRefreshParam =
    searchParams.get("auto-refresh") || DEFAULT_AUTO_REFRESH;
  const gameParam = searchParams.get("game") || DEFAULT_GAME_FILTER;
  const viewParam = searchParams.get("view") || DEFAULT_VIEW_MODE;
  const statusParam = searchParams.get("status") || DEFAULT_STATUS_SERVER;

  const refreshSeconds = SERVERS_REFRESH_OPTIONS.includes(+refreshParam)
    ? refreshParam
    : DEFAULT_REFRESH_SECONDS;
  const autoRefreshEnabled = autoRefreshParam === "true" ? true : false;

  const gameFilter = SERVERS_GAME_FILTER_OPTIONS.some(
    (option) => option.id === gameParam,
  )
    ? gameParam
    : DEFAULT_GAME_FILTER;

  const viewMode = SERVERS_VIEW_MODE.some((option) => option.id === viewParam)
    ? viewParam
    : DEFAULT_VIEW_MODE;

  const statusFilter = SERVER_STATUS_FILTER.some(
    (option) => option.id === statusParam,
  )
    ? statusParam
    : DEFAULT_STATUS_SERVER;

  const { data, isLoading, isError } = useGetServersQuery(undefined, {
    pollingInterval: autoRefreshEnabled ? refreshSeconds * 1000 : 0,
  });

  function handlerefreshParamChange(value) {
    if (value === DEFAULT_REFRESH_SECONDS) {
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
    if (value === DEFAULT_GAME_FILTER) {
      removeQueryString("game", searchParams, router, pathname);
      return;
    }

    createQueryString("game", value, searchParams, router, pathname);
  }

  function handleViewModeChange(value) {
    if (value === DEFAULT_VIEW_MODE) {
      removeQueryString("view", searchParams, router, pathname);
      return;
    }

    createQueryString("view", value, searchParams, router, pathname);
  }

  function handleStatusFilterChange(value) {
    if (value === DEFAULT_STATUS_SERVER) {
      removeQueryString("status", searchParams, router, pathname);
      return;
    }

    createQueryString("status", value, searchParams, router, pathname);
  }

  return (
    <>
      <ServersControls
        refreshSeconds={refreshSeconds}
        onRefreshSecondsChange={handlerefreshParamChange}
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
