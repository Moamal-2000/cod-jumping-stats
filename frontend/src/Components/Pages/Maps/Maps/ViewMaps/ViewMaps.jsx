"use client";

import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import MapCard from "../../MapCard/MapCard";
import MapCard2 from "../../MapCard2/MapCard2";
import s from "./ViewMaps.module.scss";

const ViewMaps = ({ mapsScroll, lastMapRef, searchTerm, filteredMaps }) => {
  const { loading, error, mapsData } = useSelector((s) => s.maps);
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || "grid";

  if (loading || error) return null;

  // Show no results message when searching and no maps found
  if (searchTerm && filteredMaps.length === 0) {
    return (
      <div className={s.noResults}>
        <h3>No maps found</h3>
        <p>No maps match "{searchTerm}"</p>
      </div>
    );
  }

  if (viewType === "list")
    return mapsScroll.map((mapData, index) => {
      return (
        <MapCard2
          key={`${mapData.CpID}-${index}`}
          mapData={mapData}
          mapsScroll={mapsScroll}
          lastMapRef={lastMapRef}
          index={index}
        />
      );
    });

  return mapsScroll.map((mapData, index) => {
    return (
      <MapCard
        key={`${mapData.CpID}-${index}`}
        mapData={mapData}
        mapsScroll={mapsScroll}
        mapsData={mapsData}
        lastMapRef={lastMapRef}
        index={index}
      />
    );
  });
};

export default ViewMaps;
