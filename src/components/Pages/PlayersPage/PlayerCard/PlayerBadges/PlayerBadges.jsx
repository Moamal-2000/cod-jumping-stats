import {
  bugHunterIds,
  contentCreatorIds,
  contentCreators,
  eventWinnerIds,
  mappersIds,
} from "@/data/manualBadges";
import { isActiveWithinWeek } from "@/functions/validation";
import Link from "next/link";
import ToolTip from "../ToolTip";
import s from "./PlayerBadges.module.scss";

const PlayerBadges = ({
  Admin,
  Banned,
  Donated,
  PlayerID,
  LastSeen,
}) => {
  const playerBadgesData = getPlayerBadges({
    cssModule: s,
    Admin,
    Banned,
    Donated,
    PlayerID,
    LastSeen,
  });

  return (
    <div className={s.badges}>
      {playerBadgesData.map(
        ({ id, displayCondition, classes, icon, label, tooltipText, href }) => {
          if (!displayCondition) return null;

          if (href)
            return (
              <Link
                key={id}
                className={`${s.badge} ${classes}`}
                href={href}
                target="_blank"
                rel="noopener"
              >
                <ToolTip>Visit youtube channel</ToolTip>
                <svg aria-hidden="true">
                  <use href={`/icons-sprite.svg#${icon}`}></use>
                </svg>
                <span>{label}</span>
              </Link>
            );

          return (
            <div key={id} className={`${s.badge} ${classes}`}>
              {tooltipText && <ToolTip>{tooltipText}</ToolTip>}
              <svg aria-hidden="true">
                <use href={`/icons-sprite.svg#${icon}`}></use>
              </svg>
              <span>{label}</span>
            </div>
          );
        },
      )}
    </div>
  );
};

export default PlayerBadges;

export function getPlayerBadges({
  cssModule,
  Admin,
  Banned,
  Donated,
  PlayerID,
  LastSeen,
}) {
  return [
    {
      displayCondition: Banned,
      classes: cssModule.Banned,
      icon: "ban",
      label: "Banned",
      id: 2,
    },
    {
      displayCondition: Donated,
      classes: cssModule.donator,
      icon: "crown",
      label: "Donator",
      id: 3,
    },
    {
      displayCondition: isActiveWithinWeek(LastSeen),
      classes: cssModule.active,
      icon: "activeStatus",
      label: "Active",
      tooltipText: "Player was active within the last 7 days",
      id: 4,
    },
    {
      displayCondition: mappersIds.includes(PlayerID),
      classes: cssModule.mapper,
      icon: "special-mapper",
      label: "Mapper",
      id: 7,
    },
    {
      displayCondition: eventWinnerIds.includes(PlayerID),
      classes: cssModule.eventWinner,
      icon: "trophy",
      label: "Winner",
      tooltipText: "Event winner",
      id: 11,
    },
    {
      displayCondition: bugHunterIds.includes(PlayerID),
      classes: cssModule.bugHunter,
      icon: "exclamation-mark",
      label: "Bug Hunter",
      tooltipText: "Helped fix bugs",
      id: 12,
    },
    {
      displayCondition: contentCreatorIds.includes(PlayerID),
      classes: cssModule.contentCreator,
      icon: "youtube",
      label: "Creator",
      href: contentCreators.find((c) => c.playerId === PlayerID)?.channelUrl,
      id: 14,
    },
    {
      displayCondition: Admin >= 100,
      classes: cssModule.highLevel,
      icon: "star",
      label: "Admin",
      id: 5,
    },
    {
      displayCondition: PlayerID === 1,
      classes: cssModule.owner,
      icon: "diamond",
      label: "Owner",
      id: 6,
    },
  ];
}
