import OnlinePlayerItem from "./OnlinePlayerItem/OnlinePlayerItem";
import s from "./OnlinePlayersList.module.scss";

const OnlinePlayersList = ({ server }) => {
  return (
    <div className={s.playersList}>
      {server.players.map((player, index) => (
        <OnlinePlayerItem key={index} player={player} server={server} />
      ))}
    </div>
  );
};

export default OnlinePlayersList;
