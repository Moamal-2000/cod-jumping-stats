import s from "./GameType.module.scss";
import ServerCard from "./ServerCard/ServerCard";

const GameType = ({ gameType, groupedServers }) => {
  return (
    <div className={s.serversGrid} key={gameType}>
      {groupedServers[gameType].map((server) => (
        <ServerCard
          key={`${server.domain}${server.ip}${server.port}`}
          server={server}
        />
      ))}
    </div>
  );
};

export default GameType;
