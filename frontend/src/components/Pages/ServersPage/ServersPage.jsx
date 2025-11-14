"use client";

import { useGetServersQuery } from "@/redux/features/servers/api/serversSlice";
import AllServers from "./AllServers/AllServers";
import PlayerToolTip from "./PlayerToolTip/PlayerToolTip";

const ServersPage = () => {
  const { data: servers, isLoading, isError } = useGetServersQuery();

  return (
    <>
      <AllServers servers={servers} loading={isLoading} error={isError} />
      <PlayerToolTip />
    </>
  );
};

export default ServersPage;
