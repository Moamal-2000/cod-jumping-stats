"use client";

import SearchInput from "@/Components/Shared/Inputs/SearchInput/SearchInput";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../RunAnalytics.module.scss";

const MapList = ({ allMaps, selectedCpid, onSelect }) => {
  const [filteredMaps, setFilteredMaps] = useState(allMaps);

  const searchParams = useSearchParams();
  const mapName = searchParams.get("mapname") || "";

  useEffect(() => {
    if (mapName === "") {
      setFilteredMaps(allMaps);
      return;
    }

    const filteredMaps = allMaps.filter((map) =>
      map.Name.toLowerCase().includes(mapName.toLowerCase())
    );

    setFilteredMaps(filteredMaps);
  }, [mapName]);

  return (
    <div className={styles.leftPanel}>
      <SearchInput placeholder="Search map by name" queryName="mapname" />

      <div className={styles.mapsList} role="list">
        {filteredMaps.map((map) => {
          const active = selectedCpid === map.CpID;

          return (
            <button
              key={map.CpID}
              className={`${styles.mapButton} ${
                active ? styles.mapButtonActive : ""
              }`}
              onClick={() => onSelect(map.CpID)}
              role="listitem"
              aria-pressed={active}
            >
              <span>{map.Name}</span>
              <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                {map?.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MapList;
