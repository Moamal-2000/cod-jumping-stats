"use client";
import SearchInput from "@/Components/Shared/Inputs/SearchInput/SearchInput";
import styles from "../RunAnalytics.module.scss";

const MapList = ({ allMaps, selectedCpid, onSelect }) => {
  return (
    <div className={styles.leftPanel}>
      <SearchInput placeholder="Search map by name" queryName="mapname" />

      <div className={styles.mapsList} role="list">
        {allMaps.map((map) => {
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
