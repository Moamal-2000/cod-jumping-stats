"use client";

import { jhApis } from "@/Api/jumpersHeaven";
import { decodeAsyncData, fetchMsgPackResponse } from "@/Functions/utils";
import { useEffect, useState } from "react";
import AllServers from "./AllServers/AllServers";
import ServersHeader from "./ServersHeader/ServersHeader";

const ServersPage = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetchMsgPackResponse({
          url: jhApis().player.getOnlinePlayers,
          cache: "no-cache",
        });

        if (!response.ok) throw new Error("Failed to fetch server data");

        const data = await decodeAsyncData(response);
        setServers(data.Servers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  return (
    <div>
      <ServersHeader />
      <AllServers servers={servers} loading={loading} error={error} />
    </div>
  );
};

export default ServersPage;
