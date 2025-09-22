import SvgIcon from "@/Components/Shared/SvgIcon";
import s from "./PlayerBadges.module.scss";

const PlayerBadges = ({ adminLevel, banned, donated, id, name }) => {
  const playerBadgesData = getPlayerBadges({
    cssModule: s,
    adminLevel,
    banned,
    donated,
    id,
    name,
  });

  return (
    <div className={s.badges}>
      {playerBadgesData.map(
        ({ id, displayCondition, classes, icon, label }) => {
          if (!displayCondition) return null;

          return (
            <div key={id} className={`${s.badge} ${classes}`}>
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
}) {
  return [
    {
      displayCondition: adminLevel > 0,
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
      displayCondition: id === 1 && name === "IzNoGoD",
      classes: cssModule.owner,
      icon: "diamond",
      label: "Owner",
      id: 4,
    },
    {
      displayCondition: adminLevel === 100,
      classes: `${cssModule.adminBadge} ${cssModule.highLevel}`,
      icon: "star",
      label: "Admin",
      id: 5,
    },
  ];
}
