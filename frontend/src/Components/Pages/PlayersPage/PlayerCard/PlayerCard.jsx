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
        <div className={s.wrapper}>
          <div className={s.country}>
            <CountryImage
              countryCode={country}
              size={40}
              colorPlaceholder={true}
            />
          </div>

          <PlayerPrimaryInfo name={name} adminLevel={adminLevel} id={id} />
        </div>

        <PlayerBadges
          adminLevel={adminLevel}
          banned={banned}
          donated={donated}
          id={id}
          name={name}
          lastSeen={lastSeen}
        />
      </div>

      <PlayerStats lastSeen={lastSeen} visitCount={visitCount} />
    </div>
  );
};

export default PlayerCard;
