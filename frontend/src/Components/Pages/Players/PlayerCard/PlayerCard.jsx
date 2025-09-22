import CountryImage from "@/Components/Shared/Images/CountryImage/CountryImage";
import SvgIcon from "@/Components/Shared/SvgIcon";
import s from "./Player.module.scss";
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
            <div className={s.badges}>
              {adminLevel > 0 && (
                <div className={s.adminBadge}>
                  <SvgIcon name={"shield"} />
                  <span>{adminLevel}</span>
                </div>
              )}
              {banned && (
                <div className={s.banned}>
                  <SvgIcon name="ban" />
                  <span>Banned</span>
                </div>
              )}
              {donated && (
                <div className={s.donator}>
                  <SvgIcon name="crown" />
                  <span>Donator</span>
                </div>
              )}
              {id === 1 && name === "IzNoGoD" && (
                <div className={s.owner}>
                  <SvgIcon name="diamond" />
                  <span>Owner</span>
                </div>
              )}
              {adminLevel === 100 && (
                <div className={`${s.adminBadge} ${s.highLevel}`}>
                  <SvgIcon name="star" />
                  <span>Admin</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <PlayerStats lastSeen={lastSeen} visitCount={visitCount} />
      </div>
    </div>
  );
};

export default PlayerCard;
