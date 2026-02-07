import { getCodServers, getGameTypes } from "@/functions/utils";
import GameType from "./GameType/GameType";
import ServersLoadingError from "./ServersLoadingError/ServersLoadingError";

const AllServers = ({ servers, loading, error, gameFilter, viewMode }) => {
  const normalizedFilter = gameFilter?.toLowerCase();
  const filteredServers =
    normalizedFilter && normalizedFilter !== "all"
      ? servers?.filter((server) =>
          String(server?.GameType || "")
            .toLowerCase()
            .includes(normalizedFilter),
        )
      : servers;

  const groupedServers = getCodServers(filteredServers);
  const gameTypes = getGameTypes(groupedServers);

  if (loading || error) {
    return <ServersLoadingError loading={loading} error={error} />;
  }

  return gameTypes.map((gameType) => (
    <GameType
      key={gameType}
      gameType={gameType}
      groupedServers={groupedServers}
      viewMode={viewMode}
    />
  ));
};

export default AllServers;
