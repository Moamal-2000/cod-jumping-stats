import OnlinePlayersList from "./OnlinePlayersList/OnlinePlayersList";
import s from "./ServerCard.module.scss";

const ServerCardPlayersSection = ({ server, isCod4 }) => {
  const hasPlayers =
    server.online && server.players && server.players.length > 0;

  return (
    <div className={s.playersSection}>
      {hasPlayers && <OnlinePlayersList server={server} isCod4={isCod4} />}

      {!hasPlayers && (
        <p className={s.noPlayersText}>This server is currently empty</p>
      )}
    </div>
  );
};

export default ServerCardPlayersSection;
