import s from "./GameType.module.scss";
import ServerCard from "./ServerCard/ServerCard";
import ServersList from "./ServersList/ServersList";

const GameType = ({ gameType, groupedServers, viewMode }) => {
  if (viewMode === "list") {
    return <ServersList groupedServers={groupedServers} gameType={gameType} />;
  }

  return (
    <div className={s.serversGrid} key={gameType}>
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
