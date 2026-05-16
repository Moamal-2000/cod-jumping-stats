import {
  bugHunterIds,
  contentCreators,
  eventWinnerIds,
  mappersIds,
} from "@/data/manualBadges";
import { isActiveWithinWeek } from "@/lib/validation";
import s from "./BadgeStats.module.scss";

const BadgeStats = ({ playersData }) => {
  const badgesArray = [
    {
      id: "all",
      label: "Total Players",
      count: playersData.length,
      urlQuery: "all",
    },
    {
      id: "winner",
      label: "Event Winners",
      count: eventWinnerIds.length,
      urlQuery: "winner",
    },
    {
      id: "bugHunter",
      label: "Bug Hunters",
      count: bugHunterIds.length,
      urlQuery: "bug-hunter",
    },
    {
      id: "admin",
      label: "Admins",
      count: playersData.filter((player) => player.Admin >= 100).length,
      urlQuery: "admin",
    },
    {
      id: "mapper",
      label: "Mappers",
      count: mappersIds.length,
      urlQuery: "mapper",
    },
    {
      id: "creator",
      label: "Content Creators",
      count: contentCreators.length,
      urlQuery: "creator",
    },
    {
      id: "donator",
      label: "Donators",
      count: playersData.filter((player) => player.Donated === 1).length,
      urlQuery: "donator",
    },
    {
      id: "active",
      label: "Active Players",
      count: playersData.filter((player) => isActiveWithinWeek(player.LastSeen))
        .length,
      urlQuery: "active",
    },
    {
      id: "banned",
      label: "Banned",
      count: playersData.filter((player) => player.Banned === 1).length,
      urlQuery: "banned",
    },
  ];

  return (
    <div className={s.badgesCountContainer}>
      {badgesArray.map((badge) => (
        <div key={badge.id} className={s.badgeCountItem}>
          <span className={s.badgeCountLabel}>{badge.label}</span>
          <span className={s.badgeCountValue}>{badge.count}</span>
        </div>
      ))}
    </div>
  );
};
export default BadgeStats;
