import { getMapRoutes } from "@/Components/Shared/MapRoutesSelector/MapRoutesSelector";
import s from "./MapRoutes.module.scss";

const MapRoutes = ({ allMaps, selectedMapId, selectMapRoute }) => {
  const selectedMap = allMaps.find((map) => map.CpID === selectedMapId) || {};

  const mapRoutes = getMapRoutes({
    allMaps,
    Name: selectedMap?.Name,
    Ender: selectedMap?.Ender,
  });

  if (mapRoutes.length <= 0) return null;

  return (
    <div className={s.mapRoutesSelector}>
      <label htmlFor="map-routes">Routes</label>

      <div className="routes">
        {mapRoutes.map((route) => (
          <button
            type="button"
            key={route.CpID}
            onClick={() => selectMapRoute(route.CpID)}
          >
            {route.Ender}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapRoutes;
