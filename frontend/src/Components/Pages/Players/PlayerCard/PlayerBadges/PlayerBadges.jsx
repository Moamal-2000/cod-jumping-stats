import SvgIcon from "@/Components/Shared/SvgIcon";
import { isActiveWithinWeek } from "@/Functions/utils";
import ToolTip from "../ToolTip";
import s from "./PlayerBadges.module.scss";

const PlayerBadges = ({ adminLevel, banned, donated, id, name, lastSeen }) => {
  const playerBadgesData = getPlayerBadges({
    cssModule: s,
    adminLevel,
    banned,
    donated,
    id,
    name,
    lastSeen,
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
}) {
  return [
    {
      displayCondition: true,
      classes: cssModule.adminBadge,
      icon: "shield",
      label: adminLevel,
      id: 1,
    },
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
      displayCondition: adminLevel >= 100,
      classes: `${cssModule.adminBadge} ${cssModule.highLevel}`,
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
