"use client";

import {
  SERVER_STATUS_FILTER,
  SERVERS_GAME_FILTER_OPTIONS,
  SERVERS_REFRESH_OPTIONS,
} from "@/data/constants";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { useGetServersQuery } from "@/redux/features/servers/api/serversSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AllServers from "./AllServers/AllServers";
import PlayerToolTip from "./PlayerToolTip/PlayerToolTip";
import ServersControls from "./ServersControls/ServersControls";
import ServersRefreshIndicator from "./ServersRefreshIndicator/ServersRefreshIndicator";

const DEFAULT_REFRESH_SECONDS = "30";
const DEFAULT_GAME_FILTER = "cod2";
const DEFAULT_STATUS_SERVER = "all";
const DEFAULT_MOD_SERVERS = "jh";

const ServersPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const refreshParam = searchParams.get("refresh") || DEFAULT_REFRESH_SECONDS;
  const gameParam = searchParams.get("game") || DEFAULT_GAME_FILTER;
  const statusParam = searchParams.get("status") || DEFAULT_STATUS_SERVER;
  const sourceParam = searchParams.get("source");

  const refreshSeconds = SERVERS_REFRESH_OPTIONS.includes(refreshParam)
    ? refreshParam
    : DEFAULT_REFRESH_SECONDS;
  const autoRefreshEnabled = refreshParam !== "disabled" ? true : false;

  const gameFilter = SERVERS_GAME_FILTER_OPTIONS.some(
    (option) => option.id === gameParam,
  )
    ? gameParam
    : DEFAULT_GAME_FILTER;

  const statusFilter = SERVER_STATUS_FILTER.some(
    (option) => option.id === statusParam,
  )
    ? statusParam
    : DEFAULT_STATUS_SERVER;

  const { data, isLoading, isError, refetch } = useGetServersQuery(sourceParam);

  function onModChange(value) {
    if (value === DEFAULT_MOD_SERVERS) {
      removeQueryString("source", searchParams, router, pathname);
      return;
    }

    createQueryString("source", value, searchParams, router, pathname);
  }

  function handleRefreshParamChange(value) {
    if (value === DEFAULT_REFRESH_SECONDS) {
      removeQueryString("refresh", searchParams, router, pathname);
      return;
    }

    createQueryString("refresh", value, searchParams, router, pathname);
  }

  function handleGameFilterChange(value) {
    if (value === DEFAULT_GAME_FILTER) {
      removeQueryString("game", searchParams, router, pathname);
      return;
    }

    createQueryString("game", value, searchParams, router, pathname);
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
        onModChange={onModChange}
        sourceParam={sourceParam || DEFAULT_MOD_SERVERS}
        onRefreshSecondsChange={handleRefreshParamChange}
        autoRefreshEnabled={autoRefreshEnabled}
        gameFilter={gameFilter}
        onGameFilterChange={handleGameFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
      <AllServers
        servers={data?.Servers}
        loading={isLoading}
        error={isError}
        gameFilter={gameFilter}
        statusFilter={statusFilter}
        gameParam={gameParam}
      />
      <PlayerToolTip />
      <ServersRefreshIndicator
        onRefresh={refetch}
        refreshSeconds={refreshSeconds}
      />
    </>
  );
};

export default ServersPage;
