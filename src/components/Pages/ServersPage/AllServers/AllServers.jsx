import useFakeLoader from "@/hooks/app/useFakeLoader";
import GameType from "./GameType/GameType";
import ServersLoadingError from "./ServersLoadingError/ServersLoadingError";

const AllServers = ({
  servers,
  loading,
  error,
  gameFilter,
  statusFilter,
  gameParam,
}) => {
  const fakeLoading = useFakeLoader();

  const normalizedFilter = gameFilter?.toLowerCase();
  const filteredServers =
    normalizedFilter && normalizedFilter !== "all"
      ? servers?.filter((server) =>
          String(server?.GameType || "")
            .toLowerCase()
            .includes(normalizedFilter),
        )
      : servers;

  const statusFilteredServers =
    statusFilter === "with-players"
      ? filteredServers?.filter(
          (server) =>
            server?.Online &&
            ((server?.Players && server.Players.length > 0) ||
              (server?.PlayerCount || 0) > 0),
        )
      : filteredServers;

  const groupedServers = getCodServers(statusFilteredServers);
  const gameTypes = getGameTypes(groupedServers);

  if (loading || fakeLoading || error) {
    return (
      <ServersLoadingError
        loading={loading || fakeLoading}
        error={error}
        gameParam={gameParam}
      />
    );
  }

  return gameTypes.map((gameType) => (
    <GameType
      key={gameType}
      gameType={gameType}
      groupedServers={groupedServers}
    />
  ));
};

export default AllServers;

function getCodServers(servers = []) {
  return servers.reduce((groups, server) => {
    const gameType = server.GameType;
    if (!groups[gameType]) {
      groups[gameType] = [];
    }

    groups[gameType].push(server);
    return groups;
  }, {});
}

function getGameTypes(groupedServers) {
  return Object.keys(groupedServers).sort(
    (a, b) => a.replace(/\D/g, "") - b.replace(/\D/g, ""),
  );
}
