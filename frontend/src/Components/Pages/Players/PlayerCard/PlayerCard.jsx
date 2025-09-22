import CountryImage from "@/Components/Shared/Images/CountryImage/CountryImage";
import SvgIcon from "@/Components/Shared/SvgIcon";
import { getColoredName } from "@/Functions/components";
import Link from "next/link";
import s from "./Player.module.scss";

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
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Unknown";
    try {
      const date = new Date(lastSeen);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return date.toLocaleDateString();
    } catch {
      return lastSeen;
    }
  };

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
            <div className={s.primaryInfo}>
              <Link href={`/player/${id || rank}`} className={s.playerName}>
                {getColoredName(name)}
              </Link>
              <span className={s.playerId}>#{id}</span>
            </div>
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

        <div className={s.statsGrid}>
          <div className={s.statItem}>
            <span className={s.statLabel}>
              <SvgIcon name="footsteps" /> Visits:
            </span>
            <span className={s.statValue}>{visitCount.toLocaleString()}</span>
          </div>
          <div className={s.statItem}>
            <span className={s.statLabel}>
              <SvgIcon name="clock" /> Last seen:
            </span>
            <span className={s.statValue}>{formatLastSeen(lastSeen)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
