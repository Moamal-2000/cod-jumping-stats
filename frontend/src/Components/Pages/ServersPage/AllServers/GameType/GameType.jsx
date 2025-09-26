import s from "./GameType.module.scss";
import ServerCard from "./ServerCard/ServerCard";

const GameType = ({ gameType, groupedServers }) => {
  return (
    <div className={s.serversGrid} key={gameType}>
      {groupedServers[gameType].map((server) => (
        <ServerCard
          key={`${server.Domain}${server.IP}${server.Port}`}
          server={server}
        />
      ))}
    </div>
  );
};

export default GameType;
