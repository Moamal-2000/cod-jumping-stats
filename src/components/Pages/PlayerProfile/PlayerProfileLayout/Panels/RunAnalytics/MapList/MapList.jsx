"use client";

import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import AnimatedSpinnerIcon from "@/components/Shared/Loaders/SpinnerLoader/AnimatedSpinnerIcon";
import { createQueryString } from "@/lib/queryParams";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import s from "./MapList.module.scss";

const MapList = ({
  allMaps = [],
  selectedMapId,
  selectMapRoute,
  isLoading = false,
  isCollapsed = false,
  setHoveredMapName,
  onToggleCollapse = () => {},
}) => {
  const [filteredMaps, setFilteredMaps] = useState(allMaps);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mapName = searchParams.get("mapname") || "";
  const mapType = searchParams.get("maptype") || "all";
  const sourceParam = searchParams.get("source") || "jh";

  const title = isCollapsed ? "Show map list" : "Hide map list";

  function handleSelectMapType(type) {
    createQueryString("maptype", type, searchParams, router, pathname);
  }

  function onMapHover(mapName) {
    setHoveredMapName(mapName);
  }

  function onMapLeave() {
    setHoveredMapName(null);
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
        title={title}
        aria-label={title}
        aria-expanded={!isCollapsed}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={`${isCollapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}`} />
        </svg>
      </button>

      <section
        className={`${s.leftPanel} ${isCollapsed ? s.leftPanelCollapsed : ""}`}
        onMouseLeave={onMapLeave}
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
              <AnimatedSpinnerIcon />
              <p>Loading maps...</p>
            </div>
          )}

          {!isLoading && (
            <div className={s.mapsList} role="list">
              {filteredMaps.length === 0 && mapName ? (
                <div className={s.emptyState}>
                  <svg aria-hidden="true">
                    <use href="/icons-sprite.svg#search" />
                  </svg>
                  <p>No maps found matching "{mapName}"</p>
                </div>
              ) : (
                filteredMaps.map((map) => {
                  const isActive = selectedMapId === map.CpID;
                  const mapDetailsHref = `/map/${map.CpID}${sourceParam === "jh" ? "" : `?source=${sourceParam}`}`;

                  return (
                    <div
                      key={map.CpID}
                      role="listitem"
                      className={`${s.mapButtonWrapper} ${s.fadeIn}`}
                      onMouseEnter={() => onMapHover(map.Name)}
                    >
                      <button
                        type="button"
                        className={`${s.mapButton} ${isActive ? s.active : ""}`}
                        onClick={() => selectMapRoute(map.CpID)}
                        onFocus={() => onMapHover(map.Name)}
                        aria-pressed={isActive}
                        aria-label={`Select ${map.Name} map`}
                      >
                        <span className={s.mapName}>{map.Name}</span>
                        {map.Ender && (
                          <span className={s.mapRoute}>{map.Ender}</span>
                        )}
                      </button>

                      <Link
                        className={s.mapTooltip}
                        href={mapDetailsHref}
                        target="_blank"
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
