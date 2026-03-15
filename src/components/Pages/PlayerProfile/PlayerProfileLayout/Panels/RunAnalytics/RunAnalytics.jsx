"use client";

import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import SelectMenu from "@/components/Shared/SelectMenus/SelectMenu/SelectMenu";
import { createQueryString } from "@/lib/queryParams";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { fetchMapRuns } from "@/redux/features/playerProfile/thunk/playerProfileThunk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Graph from "./Graph/Graph";
import MapList from "./MapList/MapList";
import MapRoutes from "./MapRoutes/MapRoutes";
import s from "./RunAnalytics.module.scss";

const fpsOptions = [
  { label: "43 FPS", value: "43", id: 1 },
  { label: "76 FPS", value: "76", id: 2 },
  { label: "125 FPS", value: "125", id: 3 },
  { label: "250 FPS", value: "250", id: 4 },
  { label: "333 FPS", value: "333", id: 5 },
];

const RunAnalytics = ({ playerId }) => {
  const { mapRuns, mapRunsLoading } = useSelector((s) => s.playerProfile);
  const { allMaps, loading } = useSelector((s) => s.maps);

  const [isMapListCollapsed, setIsMapListCollapsed] = useState(false);
  const [hoveredMapName, setHoveredMapName] = useState("");
  const [showChartElements, setShowChartElements] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const selectedFps = searchParams.get("fps") || 125;
  const firstMapId = parseInt(allMaps[0]?.CpID, 10);
  const selectedMapId = parseInt(searchParams.get("mapid"), 10) || firstMapId;
  const previewMapName = hoveredMapName || "";

  function handleFpsChange(event) {
    createQueryString(
      "fps",
      event.target.value,
      searchParams,
      router,
      pathname,
    );
  }

  function selectMapRoute(mapId) {
    createQueryString("mapid", mapId, searchParams, router, pathname);
  }

  useEffect(() => {
    if (allMaps.length <= 0) dispatch(fetchMaps());

    dispatch(fetchMapRuns({ playerId, cpId: selectedMapId, fps: selectedFps }));
  }, [selectedMapId, selectedFps, playerId]);

  return (
    <div
      className={`${s.container} ${isMapListCollapsed ? s.containerCollapsed : ""}`}
    >
      <MapList
        allMaps={allMaps}
        selectedMapId={selectedMapId}
        selectMapRoute={selectMapRoute}
        isLoading={loading}
        isCollapsed={isMapListCollapsed}
        setHoveredMapName={setHoveredMapName}
        onToggleCollapse={() => setIsMapListCollapsed((previous) => !previous)}
      />

      <div className={s.rightPanel}>
        <div className={s.graphHeader}>
          <h2 className={s.graphTitle}>
            {mapRuns?.length >= 1 ? `${mapRuns?.length || 0} Runs` : ""}
          </h2>

          <div className={s.options}>
            <MapRoutes
              allMaps={allMaps}
              selectedMapId={selectedMapId}
              selectMapRoute={selectMapRoute}
            />

            <label className={s.chartToggle}>
              <input
                type="checkbox"
                checked={showChartElements}
                onChange={(event) => setShowChartElements(event.target.checked)}
                className={s.chartToggleInput}
              />
              <span className={s.chartToggleText}>show chart elements</span>
            </label>

            <SelectMenu
              label="FPS"
              onChange={handleFpsChange}
              optionsData={fpsOptions}
              value={selectedFps}
            />
          </div>
        </div>

        <div className={s.graphWrapper}>
          {previewMapName && (
            <div className={s.previewPanel}>
              <MapImage
                containerClassName={s.previewImage}
                mapName={previewMapName}
                resolution="1920"
                onError={() => setHoveredMapName(null)}
              />
            </div>
          )}

          <div className={s.graphPanel}>
            <Graph
              data={mapRuns}
              isLoading={mapRunsLoading}
              showChartElements={showChartElements}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunAnalytics;
