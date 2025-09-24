import SvgIcon from "@/Components/Shared/SvgIcon";
import {
  bugHunterIds,
  communityHelperIds,
  contentCreatorIds,
  eventWinnerIds,
} from "@/Data/manualBadges";
import { isActiveWithinWeek } from "@/Functions/utils";
import ToolTip from "../ToolTip";
import s from "./PlayerBadges.module.scss";

const PlayerBadges = ({
  adminLevel,
  banned,
  donated,
  id,
  name,
  lastSeen,
  playerSince,
  score,
  averageScore,
  top10Ids,
}) => {
  const playerBadgesData = getPlayerBadges({
    cssModule: s,
    adminLevel,
    banned,
    donated,
    id,
    name,
    lastSeen,
    playerSince,
    score,
    averageScore,
    top10Ids,
  });

  return (
    <div className={s.badges}>
      {playerBadgesData.map(
        ({ id, displayCondition, classes, icon, label, tooltipText }) => {
          if (!displayCondition) return null;

          return (
            <div key={id} className={`${s.badge} ${classes}`}>
              {tooltipText && <ToolTip>{tooltipText}</ToolTip>}
              <SvgIcon name={icon} />
              <span>{label}</span>
            </div>
          );
        }
      )}
    </div>
  );
};

export default PlayerBadges;

export function getPlayerBadges({
  cssModule,
  adminLevel,
  banned,
  donated,
  id,
  name,
  lastSeen,
  playerSince,
  score,
  averageScore,
  top10Ids,
}) {
  const playerSince5Years =
    playerSince <= Date.now() - 1000 * 60 * 60 * 24 * 365 * 5;

  const newPlayerSinceMonth =
    playerSince && playerSince >= Date.now() - 1000 * 60 * 60 * 24 * 30;

  return [
    {
      displayCondition: banned,
      classes: cssModule.banned,
      icon: "ban",
      label: "Banned",
      id: 2,
    },
    {
      displayCondition: donated,
      classes: cssModule.donator,
      icon: "crown",
      label: "Donator",
      id: 3,
    },
    {
      displayCondition: isActiveWithinWeek(lastSeen),
      classes: cssModule.active,
      icon: "activeStatus",
      label: "Active",
      tooltipText: "Player was active within the last 7 days",
      id: 4,
    },
    {
      displayCondition: id === 108468,
      classes: cssModule.mapper,
      icon: "map",
      label: "Mapper",
      id: 7,
    },
    // Veteran: 5+ years and above average score
    {
      displayCondition: true,
      classes: cssModule.veteran,
      icon: "timer",
      label: "Veteran",
      tooltipText: "5+ years & above avg score",
      id: 8,
    },
    // Top Scorer: Only top 10
    {
      displayCondition: Array.isArray(top10Ids) && top10Ids.includes(id),
      classes: cssModule.topScorer,
      icon: "trophy",
      label: "Top Scorer",
      tooltipText: "Top 10",
      id: 9,
    },
    // Newcomer: Joined today or within a month
    {
      displayCondition: true,
      classes: cssModule.newcomer,
      icon: "star",
      label: "Newcomer",
      id: 10,
    },
    {
      displayCondition: eventWinnerIds.includes(id),
      classes: cssModule.eventWinner,
      icon: "trophy",
      label: "Winner",
      tooltipText: "Event winner",
      id: 11,
    },
    {
      displayCondition: bugHunterIds.includes(id),
      classes: cssModule.bugHunter,
      icon: "exclamation-mark",
      label: "Bug Hunter",
      tooltipText: "Helped fix bugs",
      id: 12,
    },
    {
      displayCondition: communityHelperIds.includes(id),
      classes: cssModule.communityHelper,
      icon: "heart",
      label: "Helper",
      tooltipText: "Helped community",
      id: 13,
    },
    {
      displayCondition: contentCreatorIds.includes(id),
      classes: cssModule.contentCreator,
      icon: "youtube",
      label: "Creator",
      id: 14,
    },
    {
      displayCondition: adminLevel >= 100,
      classes: cssModule.highLevel,
      icon: "star",
      label: "Admin",
      id: 5,
    },
    {
      displayCondition: id === 1 && name === "IzNoGoD",
      classes: cssModule.owner,
      icon: "diamond",
      label: "Owner",
      id: 6,
    },
  ];
}
