import CountryImage from "@/Components/Shared/Images/CountryImage/CountryImage";
import PlayerBadges from "./PlayerBadges/PlayerBadges";
import s from "./PlayerCard.module.scss";
import PlayerPrimaryInfo from "./PlayerPrimaryInfo/PlayerPrimaryInfo";
import PlayerStats from "./PlayerStats/PlayerStats";

const PlayerCard = ({
  name,
  rank,
  id,
  adminLevel,
  lastSeen,
  visitCount,
  country,
  banned,
  donated,
}) => {
  return (
    <div className={s.playerCard}>
      <div className={s.topSection}>
        <div className={s.country}>
          <CountryImage
            countryCode={country}
            countryName={country}
            size={40}
            colorPlaceholder={true}
          />
        </div>

        <div className={s.wrapper}>
          <PlayerPrimaryInfo name={name} rank={rank} id={id} />
          <PlayerBadges
            adminLevel={adminLevel}
            banned={banned}
            donated={donated}
            id={id}
            name={name}
          />
        </div>
      </div>

      <PlayerStats lastSeen={lastSeen} visitCount={visitCount} />
    </div>
  );
};

export default PlayerCard;
