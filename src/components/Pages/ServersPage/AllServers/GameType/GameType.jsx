import s from "./GameType.module.scss";
import ServerCard from "./ServerCard/ServerCard";

const GameType = ({ gameType, groupedServers, viewMode }) => {
  const layoutClass = viewMode === "list" ? s.serversList : s.serversGrid;

  return (
    <div className={layoutClass} key={gameType}>
      {groupedServers[gameType].map((server, index) => (
        <ServerCard
          key={`${server.Domain}${server.IP}${server.Port}`}
          server={server}
          index={index}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default GameType;
