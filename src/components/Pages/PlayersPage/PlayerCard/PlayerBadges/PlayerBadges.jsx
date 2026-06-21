import {
  bugHunterIds,
  contentCreatorIds,
  contentCreators,
  eventWinnerIds,
  helperIds,
  mappersIds,
  ownerIds,
} from "@/data/manualBadges";
import { isActiveWithinWeek } from "@/lib/validation";
import ToolTip from "../ToolTip";
import s from "./PlayerBadges.module.scss";

const PlayerBadges = ({ Admin, Banned, Donated, PlayerID, LastSeen }) => {
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
          if (!displayCondition) {
            return null;
          }

          if (href) {
            return (
              <a
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
              </a>
            );
          }

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
      id: 1,
    },
    {
      displayCondition: Donated,
      classes: cssModule.donator,
      icon: "crown",
      label: "Donator",
      id: 2,
    },
    {
      displayCondition: helperIds.includes(PlayerID),
      classes: cssModule.helper,
      icon: "handshake",
      label: "Helper",
      tooltipText: "Contributed to the CJ community",
      id: 3,
    },
    {
      displayCondition: isActiveWithinWeek(LastSeen),
      classes: cssModule.active,
      icon: "active-status",
      label: "Active",
      tooltipText: "Player was active within the last 7 days",
      id: 4,
    },
    {
      displayCondition: mappersIds.includes(PlayerID),
      classes: cssModule.mapper,
      icon: "special-mapper",
      label: "Mapper",
      id: 5,
    },
    {
      displayCondition: eventWinnerIds.includes(PlayerID),
      classes: cssModule.eventWinner,
      icon: "trophy",
      label: "Winner",
      tooltipText: "Event winner",
      id: 6,
    },
    {
      displayCondition: bugHunterIds.includes(PlayerID),
      classes: cssModule.bugHunter,
      icon: "exclamation-mark",
      label: "Bug Hunter",
      tooltipText: "Helped fix bugs",
      id: 7,
    },
    {
      displayCondition: contentCreatorIds.includes(PlayerID),
      classes: cssModule.contentCreator,
      icon: "youtube",
      label: "Creator",
      href: contentCreators.find((c) => c.playerId === PlayerID)?.channelUrl,
      id: 8,
    },
    {
      displayCondition: Admin >= 100,
      classes: cssModule.highLevel,
      icon: "star",
      label: "Admin",
      id: 9,
    },
    {
      displayCondition: ownerIds.includes(PlayerID),
      classes: cssModule.owner,
      icon: "diamond",
      label: "Owner",
      id: 10,
    },
  ];
}
