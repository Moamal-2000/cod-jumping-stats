import Link from "next/link";
import s from "./MapRoutesSelector.module.scss";

const MapRoutesSelector = ({ allMaps, Name, Ender }) => {
  const otherRoutes = getMapRoutes({ allMaps, Name, Ender });

  if (otherRoutes.length <= 0) return null;

  return (
    <nav className={s.otherRoutes}>
      <p className={s.otherRoutesLabel}>Routes from this map</p>

      <div className={s.otherRoutesList}>
        {otherRoutes.map((route) => (
          <Link key={route.CpID} href={`/map?mapid=${route.CpID}`}>
            {route.Ender}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MapRoutesSelector;

export function getMapRoutes({ allMaps, Name, Ender } = {}) {
  return allMaps.filter((map) => {
    return map.Name === Name && map.Ender !== Ender;
  });
}
