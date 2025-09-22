import CountryImage from "@/Components/Shared/Images/CountryImage/CountryImage";
import SvgIcon from "@/Components/Shared/SvgIcon";
import s from "./Player.module.scss";
import PlayerBadges from "./PlayerBadges/PlayerBadges";
import PlayerPrimaryInfo from "./PlayerPrimaryInfo/PlayerPrimaryInfo";
import PlayerStats from "./PlayerStats/PlayerStats";

const PlayerCard = ({
  name,
  rank,
  avatar,
  totalPoints,
  mapsCompleted,
  bestTime,
  id,
  adminLevel,
  lastSeen,
  visitCount,
  country,
  level,
  joinDate,
  banned,
  adminSpeedrun,
  adminEmelie,
  xpSpeedrun,
  donated,
}) => {
  return (
    <div className={s.playerCard}>
      <div className={s.mainInfo}>
        <div className={s.topSection}>
          <div className={s.avatarSection}>
            <div className={s.avatar}>
              {country ? (
                <CountryImage
                  countryCode={country}
                  countryName={country}
                  size={40}
                />
              ) : (
                <SvgIcon name="users" />
              )}
            </div>
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
    </div>
  );
};

export default PlayerCard;
