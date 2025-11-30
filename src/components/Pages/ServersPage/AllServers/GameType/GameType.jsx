import s from "./GameType.module.scss";
import ServerCard from "./ServerCard/ServerCard";

const GameType = ({ gameType, groupedServers }) => {
  return (
    <div className={s.serversGrid} key={gameType}>
      {groupedServers[gameType].map((server, index) => (
        <ServerCard
          key={`${server.Domain}${server.IP}${server.Port}`}
          server={server}
          index={index}
        />
      ))}
    </div>
  );
};

export default GameType;
