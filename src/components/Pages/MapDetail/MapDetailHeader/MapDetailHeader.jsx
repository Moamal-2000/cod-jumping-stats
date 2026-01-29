import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import MapRoutesSelector from "@/components/Shared/MapRoutesSelector/MapRoutesSelector";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./MapDetailHeader.module.scss";

const MapDetailHeader = ({ mapData }) => {
  const { Name, Author, Released, Type, Ender } = mapData;

  const allMaps = useSelector((s) => s.maps.allMaps);
  const dispatch = useDispatch();

  const releaseDate = Released ? new Date(Released).getTime() : "Unknown";

  useEffect(() => {
    if (allMaps.length < 0) dispatch(fetchMaps());
  }, []);

  return (
    <div className={s.header}>
      <div className={s.mapInfo}>
        <MapImage mapName={Name} resolution="1920" />

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
              <span className={s.value}>{releaseDate}</span>
            </div>

            <div className={s.metaItem}>
              <span className={s.label}>Type:</span>
              <span className={`${s.value} ${s.typeBadge} ${s[Type]}`}>
                {Type}
              </span>
            </div>
          </div>
        </div>

        <MapRoutesSelector allMaps={allMaps} Name={Name} Ender={Ender} />
      </div>
    </div>
  );
};

export default MapDetailHeader;
