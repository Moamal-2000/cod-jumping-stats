import { getCodServers, getGameTypes } from "@/Functions/utils";
import GameType from "./GameType/GameType";
import ServersLoadingError from "./ServersLoadingError/ServersLoadingError";

const AllServers = ({ servers, loading, error }) => {
  const groupedServers = getCodServers(servers);
  const gameTypes = getGameTypes(groupedServers);

  if (loading || error) {
    return <ServersLoadingError loading={loading} error={error} />;
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
