import OnlinePlayerItem from "./OnlinePlayerItem/OnlinePlayerItem";
import s from "./OnlinePlayersList.module.scss";

const OnlinePlayersList = ({ server }) => {
  const sortBAdminPlayers = server.Players.sort((a, b) => b.Admin - a.Admin);

  return (
    <div className={s.playersList}>
      {sortBAdminPlayers.map((player, index) => (
        <OnlinePlayerItem key={index} player={player} server={server} />
      ))}
    </div>
  );
};

export default OnlinePlayersList;
