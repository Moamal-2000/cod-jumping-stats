import { getCodServers, getGameTypes } from "@/Functions/utils";
import GameType from "./GameType/GameType";

const AllServers = ({ servers }) => {
  const groupedServers = getCodServers(servers);
  const gameTypes = getGameTypes(groupedServers);

  return gameTypes.map((gameType) => (
    <GameType
      key={gameType}
      gameType={gameType}
      groupedServers={groupedServers}
    />
  ));
};

export default AllServers;
