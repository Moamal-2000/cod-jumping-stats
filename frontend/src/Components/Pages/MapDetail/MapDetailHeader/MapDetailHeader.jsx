import MapImage from "@/Components/Shared/Images/MapImage/MapImage";
import { fetchMaps } from "@/Redux/thunks/mapsThunk";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./MapDetailHeader.module.scss";

const MapDetailHeader = ({ mapData }) => {
  const { Name, Author, Released, Type, Ender } = mapData;

  const allMaps = useSelector((s) => s.maps.allMaps);
  const dispatch = useDispatch();

  const otherRoutes = allMaps.filter((map) => {
    return map.Name === Name && map.Ender !== Ender;
  });

  useEffect(() => {
    if (allMaps.length > 0) return;

    dispatch(fetchMaps());
  }, []);

  return (
    <div className={s.header}>
      <div className={s.mapInfo}>
        <div className={s.mapImage}>
          <MapImage mapName={Name} objectFit="cover" />
        </div>

        <div className={s.mapDetails}>
          <h1 className={s.mapName}>
            {Name}
            {Ender && <span className={s.ender}>{Ender}</span>}
          </h1>

          <div className={s.mapMeta}>
            <div className={s.metaItem}>
              <span className={s.label}>Author:</span>
              <span className={s.value}>{Author}</span>
            </div>

            <div className={s.metaItem}>
              <span className={s.label}>Released:</span>
              <span className={s.value}>
                {new Date(Released).toLocaleDateString()}
              </span>
            </div>

            <div className={s.metaItem}>
              <span className={s.label}>Type:</span>
              <span className={`${s.value} ${s.typeBadge} ${s[Type]}`}>
                {Type.charAt(0).toUpperCase() + Type.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {otherRoutes.length > 0 && (
          <div className={s.otherRoutes}>
            <div className={s.otherRoutesLabel} aria-hidden="true">
              Routes from this map
            </div>

            <div className={s.otherRoutesList}>
              {otherRoutes.map((route) => (
                <Link key={route.CpID} href={`/map?mapid=${route.CpID}`}>
                  {route.Ender}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapDetailHeader;
