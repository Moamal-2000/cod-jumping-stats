"use client";
import styles from "../RunAnalytics.module.scss";

const MapList = ({ maps, selectedCpid, onSelect, search, setSearch }) => {
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
        {maps.map((m) => {
          const active = selectedCpid === m.cpid;
          return (
            <button
              key={m.cpid}
              className={`${styles.mapButton} ${
                active ? styles.mapButtonActive : ""
              }`}
              onClick={() => onSelect(m.cpid)}
              role="listitem"
              aria-pressed={active}
            >
              <span>{m.mapname}</span>
              <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                {m.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MapList;
