import s from "./AdminLevel.module.scss";

const AdminLevel = ({ adminLevel }) => {
  const adminClass = getAdminShieldClass({ cssModule: s, adminLevel });

  return (
    <span className={`${s.playerAdminLevel} ${adminClass}`}>
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#shield" />
      </svg>{" "}
      {adminLevel || "N/A"}
    </span>
  );
};

export default AdminLevel;

function getAdminShieldClass({ cssModule, adminLevel }) {
  const isLevelUndefined =
    adminLevel === undefined || adminLevel === null || adminLevel === "N/A";
  if (isLevelUndefined) return null;

  const level = Number(adminLevel) || 0;

  if (level >= 90 && level <= 97) return cssModule.admin90;
  if (level >= 98 && level <= 99) return cssModule.admin98;
  if (level >= 100) return cssModule.admin100;

  return null;
}
