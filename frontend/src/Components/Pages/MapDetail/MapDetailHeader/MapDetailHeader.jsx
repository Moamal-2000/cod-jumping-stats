import MapImage from "@/Components/Shared/Images/MapImage/MapImage";
import s from "./MapDetailHeader.module.scss";

const MapDetailHeader = ({
  mapData: { Name, Author, Released, Type, Ender },
}) => {
  return (
    <div className={s.header}>
      <div className={s.mapInfo}>
        <div className={s.mapImage}>
          <MapImage mapName={Name} objectFit="cover" />
        </div>

        <div className={s.mapDetails}>
          <h1 className={s.mapName}>
            {Name}
            {Ender && <span className={s.ender}>({Ender})</span>}
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
      </div>
    </div>
  );
};

export default MapDetailHeader;
