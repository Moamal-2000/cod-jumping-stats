"use client";

import { useGetServersQuery } from "@/redux/features/servers/api/serversSlice";
import AllServers from "./AllServers/AllServers";
import PlayerToolTip from "./PlayerToolTip/PlayerToolTip";

const ServersPage = () => {
  const { data, isLoading, isError } = useGetServersQuery();

  return (
    <>
      <AllServers servers={data?.Servers} loading={isLoading} error={isError} />
      <PlayerToolTip />
    </>
  );
};

export default ServersPage;
