import OnlinePlayersList from "./OnlinePlayersList/OnlinePlayersList";
import s from "./ServerCard.module.scss";

const ServerCardPlayersSection = ({ server }) => {
  const hasPlayers =
    server.Online && server.Players && server.Players.length > 0;

  return (
    <div className={s.playersSection}>
      {hasPlayers && <OnlinePlayersList server={server} />}

      {!hasPlayers && (
        <p className={s.noPlayersText}>This server is currently empty</p>
      )}
    </div>
  );
};

export default ServerCardPlayersSection;
