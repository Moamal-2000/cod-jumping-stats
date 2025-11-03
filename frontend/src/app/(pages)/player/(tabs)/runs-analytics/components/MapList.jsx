"use client";

import SearchInput from "@/Components/Shared/Inputs/SearchInput/SearchInput";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import s from "../RunAnalytics.module.scss";

const MapList = ({ allMaps = [], selectedCpid, onSelect }) => {
  const [filteredMaps, setFilteredMaps] = useState(allMaps);
  const searchParams = useSearchParams();
  const mapName = searchParams.get("mapname") || "";

  useEffect(() => {
    if (mapName === "") {
      setFilteredMaps(allMaps);
      return;
    }

    const filtered = allMaps.filter((map) =>
      map.Name.toLowerCase().includes(mapName.toLowerCase())
    );
    setFilteredMaps(filtered);
  }, [mapName, allMaps]);

  if (allMaps.length === 0) {
    return (
      <div className={s.leftPanel}>
        <div className={s.searchContainer}>
          <SearchInput
            placeholder="Search map by name"
            queryName="mapname"
            disabled={true}
          />
        </div>
        <div className={s.emptyState}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p>No maps available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.leftPanel}>
      <div className={s.searchContainer}>
        <SearchInput placeholder="Search map by name" queryName="mapname" />
      </div>

      <div className={s.mapsList} role="list">
        {filteredMaps.length === 0 ? (
          <div className={s.emptyState}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p>No maps found matching "{mapName}"</p>
          </div>
        ) : (
          filteredMaps.map((map) => {
            const isActive = selectedCpid === map.CpID;
            return (
              <button
                key={map.CpID}
                className={`${s.mapButton} ${isActive ? s.active : ""} ${
                  s.fadeIn
                }`}
                onClick={() => onSelect(map.CpID)}
                role="listitem"
                aria-pressed={isActive}
                aria-label={`Select ${map.Name} map`}
              >
                <span>{map.Name}</span>
                {map.count !== undefined && (
                  <span className={s.mapCount}>{map.count}</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MapList;
