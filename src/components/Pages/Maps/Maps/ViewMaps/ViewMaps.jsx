"use client";

import { DEFAULT_VIEW_MODE } from "@/data/constants";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import MapCard from "../../MapCard/MapCard";
import MapCard2 from "../../MapCard2/MapCard2";
import s from "./ViewMaps.module.scss";

const ViewMaps = ({ mapsScroll, lastMapRef }) => {
  const { loading, error, allMaps } = useSelector((s) => s.maps);

  const searchParams = useSearchParams();
  const searchByAuthor = searchParams.get("author");
  const searchByName = searchParams.get("name");
  const viewType = searchParams.get("view") || DEFAULT_VIEW_MODE;

  if (loading || error) {
    return null;
  }

  const hasNoResults =
    (searchByAuthor || searchByName) && mapsScroll.length === 0;

  if (hasNoResults) {
    return (
      <div className={s.noResults}>
        <h3>No maps found</h3>
        <p>No maps match your search criteria</p>
      </div>
    );
  }

  if (viewType === "list") {
    return mapsScroll.map((mapData, index) => {
      return (
        <MapCard2
          key={`${mapData.CpID}-${index}`}
          mapData={mapData}
          mapsScroll={mapsScroll}
          allMaps={allMaps}
          lastMapRef={lastMapRef}
          index={index}
        />
      );
    });
  }

  return mapsScroll.map((mapData, index) => {
    return (
      <MapCard
        key={`${mapData.CpID}-${index}`}
        mapData={mapData}
        mapsScroll={mapsScroll}
        allMaps={allMaps}
        lastMapRef={lastMapRef}
        index={index}
      />
    );
  });
};

export default ViewMaps;
