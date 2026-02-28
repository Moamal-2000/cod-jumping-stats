"use client";

import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import s from "./RunAnalytics.module.scss";

const MapList = ({
  allMaps = [],
  selectedMapId,
  selectMapRoute,
  isLoading = false,
  isCollapsed = false,
  onToggleCollapse = () => {},
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
        map.Name.toLowerCase().includes(mapName.toLowerCase()),
      );
    }

    setFilteredMaps(filteredMaps);
  }, [allMaps, mapName, mapType]);

  return (
    <div className={s.leftPanelWrapper}>
      <button
        type="button"
        className={s.collapseButton}
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? "Show map list" : "Hide map list"}
        aria-expanded={!isCollapsed}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {isCollapsed ? (
            <path d="M9 6l6 6-6 6" />
          ) : (
            <path d="M15 6l-6 6 6 6" />
          )}
        </svg>
      </button>

      <section
        className={`${s.leftPanel} ${isCollapsed ? s.leftPanelCollapsed : ""}`}
      >
        <div
          className={`${s.leftPanelContent} ${
            isCollapsed ? s.leftPanelContentCollapsed : ""
          }`}
        >
          <header className={s.header}>
            <div className={s.searchContainer}>
              <SearchInput
                placeholder="Search map by name"
                queryName="mapname"
              />
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
          </header>

          {isLoading && (
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
          )}

          {!isLoading && (
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
                  const isActive = selectedMapId === map.CpID;
                  const mapDetailsHref = `/map/${map.CpID}`;

                  return (
                    <div
                      key={map.CpID}
                      role="listitem"
                      className={`${s.mapButtonWrapper} ${s.fadeIn}`}
                    >
                      <button
                        type="button"
                        className={`${s.mapButton} ${isActive ? s.active : ""}`}
                        onClick={() => selectMapRoute(map.CpID)}
                        aria-pressed={isActive}
                        aria-label={`Select ${map.Name} map`}
                      >
                        <span className={s.mapName}>{map.Name}</span>
                        {map.Ender && (
                          <span className={s.mapRoute}>{map.Ender}</span>
                        )}
                      </button>

                      <Link
                        href={mapDetailsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.mapTooltip}
                        role="tooltip"
                      >
                        Map details
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MapList;
