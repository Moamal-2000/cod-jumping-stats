import {
  bugHunterIds,
  contentCreators,
  eventWinnerIds,
  mappersIds,
} from "@/data/manualBadges";
import { isActiveWithinWeek } from "@/lib/validation";
import s from "./BadgeStats.module.scss";

const BadgeStats = ({ playersData }) => {
  const badgesCount = {
    winner: eventWinnerIds.length,
    bugHunter: bugHunterIds.length,
    admin: playersData.filter((player) => player.Admin >= 100).length,
    mapper: mappersIds.length,
    creator: contentCreators.length,
    donator: playersData.filter((player) => player.Donated === 1).length,
    active: playersData.filter((player) => isActiveWithinWeek(player.LastSeen))
      .length,
    banned: playersData.filter((player) => player.Banned === 1).length,
  };

  return (
    <div className={s.badgesCountContainer}>
      <div className={s.badgeCountItem}>
        <span className={s.badgeCountLabel}>Event Winners</span>
        <span className={s.badgeCountValue}>{badgesCount.winner}</span>
      </div>

      <div className={s.badgeCountItem}>
        <span className={s.badgeCountLabel}>Bug Hunters</span>
        <span className={s.badgeCountValue}>{badgesCount.bugHunter}</span>
      </div>

      <div className={s.badgeCountItem}>
        <span className={s.badgeCountLabel}>Admins</span>
        <span className={s.badgeCountValue}>{badgesCount.admin}</span>
      </div>

      <div className={s.badgeCountItem}>
        <span className={s.badgeCountLabel}>Mappers</span>
        <span className={s.badgeCountValue}>{badgesCount.mapper}</span>
      </div>

      <div className={s.badgeCountItem}>
        <span className={s.badgeCountLabel}>Content Creators</span>
        <span className={s.badgeCountValue}>{badgesCount.creator}</span>
      </div>

      <div className={s.badgeCountItem}>
        <span className={s.badgeCountLabel}>Donators</span>
        <span className={s.badgeCountValue}>{badgesCount.donator}</span>
      </div>

      <div className={s.badgeCountItem}>
        <span className={s.badgeCountLabel}>Active</span>
        <span className={s.badgeCountValue}>{badgesCount.active}</span>
      </div>

      <div className={s.badgeCountItem}>
        <span className={s.badgeCountLabel}>Banned</span>
        <span className={s.badgeCountValue}>{badgesCount.banned}</span>
      </div>
    </div>
  );
};
export default BadgeStats;
