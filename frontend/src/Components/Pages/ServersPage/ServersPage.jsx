"use client";

import { jhApis } from "@/Api/jumpersHeaven";
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
        const response = await fetch(jhApis().player.getOnlinePlayers, {
          cache: "no-cache",
        });
        if (!response.ok) throw new Error("Failed to fetch server data");
        const data = await response.json();
        setServers(data.servers || []);
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
