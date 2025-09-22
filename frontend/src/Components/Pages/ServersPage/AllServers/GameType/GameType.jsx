import s from "./GameType.module.scss";
import ServerCard from "./ServerCard/ServerCard";

const GameType = ({ gameType, groupedServers }) => {
  return (
    <div key={gameType} className={s.gameSection}>
      {/* <h2 className={s.gameTitle}>
        {gameType === "COD2" ? "Call of Duty 2" : "Call of Duty 4"}
      </h2> */}

      <div className={s.serversGrid}>
        {groupedServers[gameType].map((server) => (
          <ServerCard
            key={`${server.domain}${server.ip}${server.port}`}
            server={server}
          />
        ))}
      </div>
    </div>
  );
};

export default GameType;
