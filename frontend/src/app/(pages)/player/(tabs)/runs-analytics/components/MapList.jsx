"use client";
import styles from "../RunAnalytics.module.scss";

const MapList = ({ allMaps, selectedCpid, onSelect, search, setSearch }) => {
  return (
    <div className={styles.leftPanel}>
      <div className={styles.searchWrap}>
        <input
          aria-label="Search maps"
          placeholder="Search map by name"
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
