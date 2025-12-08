import CardHeader from "./CardHeader/CardHeader";
import PlayerBadges from "./PlayerBadges/PlayerBadges";
import s from "./PlayerCard.module.scss";
import PlayerStats from "./PlayerStats/PlayerStats";

const PlayerCard = ({
  PlayerName,
  PrefName,
  PlayerID,
  Admin,
  LastSeen,
  Visits,
  Country,
  Banned,
  Donated,
}) => {
  return (
    <div className={s.playerCard}>
      <div className={s.topSection}>
        <CardHeader
          PlayerName={PlayerName}
          PrefName={PrefName}
          PlayerID={PlayerID}
          Country={Country}
          Admin={Admin}
        />

        <PlayerBadges
          Admin={Admin}
          Banned={Banned}
          Donated={Donated}
          PlayerID={PlayerID}
          LastSeen={LastSeen}
        />
      </div>

      <PlayerStats LastSeen={LastSeen} Visits={Visits} />
    </div>
  );
};

export default PlayerCard;
