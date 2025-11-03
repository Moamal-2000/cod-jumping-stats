"use client";

import SearchInput from "@/Components/Shared/Inputs/SearchInput/SearchInput";
import { createQueryString } from "@/Functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import s from "../RunAnalytics.module.scss";

const MapList = ({
  allMaps = [],
  selectedCpid,
  onSelect,
  isLoading = false,
}) => {
  const [filteredMaps, setFilteredMaps] = useState(allMaps);

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const mapName = searchParams.get("mapname") || "";
  const mapType = searchParams.get("maptype") || "all";

  function handleSelectMapType(type) {
    createQueryString("maptype", type, searchParams, router, pathname);
  }

  useEffect(() => {
    let filteredMaps = allMaps;

    if (mapType && mapType !== "all") {
      filteredMaps = allMaps.filter((map) => map.Type === mapType);
    }

    if (mapName !== "") {
      filteredMaps = filteredMaps.filter((map) =>
        map.Name.toLowerCase().includes(mapName.toLowerCase())
      );
    }

    setFilteredMaps(filteredMaps);
  }, [allMaps, mapName, mapType]);

  if (isLoading) {
    return (
      <div className={s.leftPanel}>
        <div className={s.searchContainer}>
          <SearchInput
            placeholder="Search map by name"
            queryName="mapname"
            disabled={true}
          />
        </div>

        <div className={s.loadingState}>
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
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p>Loading maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.leftPanel}>
      <div className={s.searchContainer}>
        <SearchInput placeholder="Search map by name" queryName="mapname" />
      </div>

      <div className={s.mapsTypes}>
        {["All", "Jump", "Defrag", "Surf"].map((type) => (
          <button
            key={type}
            className={`${s.mapType} ${
              mapType === type.toLowerCase() ? s.active : ""
            }`}
            onClick={() => handleSelectMapType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className={s.mapsList} role="list">
        {filteredMaps.length === 0 && mapName ? (
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
                {map.Ender && <span className={s.mapRoute}>{map.Ender}</span>}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MapList;
