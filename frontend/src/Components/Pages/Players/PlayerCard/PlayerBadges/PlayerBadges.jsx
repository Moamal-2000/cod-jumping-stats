import SvgIcon from "@/Components/Shared/SvgIcon";
import s from "./PlayerBadges.module.scss";

const PlayerBadges = ({ adminLevel, banned, donated, id, name }) => {
  return (
    <div className={s.badges}>
      {adminLevel > 0 && (
        <div className={s.adminBadge}>
          <SvgIcon name="shield" />
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
  );
};

export default PlayerBadges;
