"use client";

import Breadcrumbs from "@/components/Shared/Breadcrumbs/Breadcrumbs";
import { createQueryString } from "@/lib/queryParams";
import {
  fetchMapPlayers,
  fetchMapTops,
} from "@/redux/features/map/thunk/mapThunk";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapDetailHeader from "./MapDetailHeader/MapDetailHeader";
import MapDetailInfo from "./MapDetailInfo/MapDetailInfo";
import s from "./MapDetailPage.module.scss";
import MapVideos from "./MapVideos/MapVideos";
import PageLoadingError from "./PageLoadingError/PageLoadingError";
import TabsSection from "./TabsSection/TabsSection";

const MapDetailPage = ({ cpId }) => {
  const [hasMoreTops, setHasMoreTops] = useState(true);

  const topsLoadMoreRef = useRef(null);

  const [showingAllTops, setShowingAllTops] = useState(false);

  const { allMaps, loading, error } = useSelector((s) => s.maps);

  const mapData = allMaps.find((map) => map.CpID === +cpId);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedFps = normalizeFpsQuery(searchParams.get("fps"));
  const activeTab = searchParams.get("tab") || "tops";

  function handleFpsChange(nextFps) {
    const normalizedFps = normalizeFpsQuery(nextFps);
    if (normalizedFps === selectedFps) return;

    createQueryString("fps", normalizedFps, searchParams, router, pathname);
  }

  useEffect(() => {
    if (activeTab === "tops")
      dispatch(fetchMapTops({ fps: selectedFps, cpId }));
  }, [activeTab, selectedFps, cpId, dispatch]);

  useEffect(() => {
    if (activeTab === "players" && mapData?.ID) {
      dispatch(fetchMapPlayers({ fps: selectedFps, mapId: mapData.ID }));
    }
  }, [activeTab, selectedFps, mapData?.ID, dispatch]);

  useEffect(() => {
    if (cpId) dispatch(fetchMaps());
  }, [cpId]);

  useEffect(() => {
    if (mapData) {
      setHasMoreTops(true);
      setShowingAllTops(false);
    }
  }, [mapData, selectedFps]);

  if (loading || error || !mapData) {
    return (
      <PageLoadingError loading={loading} error={error} mapData={mapData} />
    );
  }

  return (
    <div className="container">
      <main className={s.mapDetailPage}>
        <Breadcrumbs
          breadcrumbLabels={breadcrumbLabels(mapData?.Name)}
          breadcrumbPaths={breadcrumbPaths}
        />

        <MapDetailHeader mapData={mapData} />

        <div className={s.contentGrid}>
          <div className={s.leftColumn}>
            <MapDetailInfo
              mapData={mapData}
              selectedFps={selectedFps}
              onFpsChange={handleFpsChange}
            />
            {mapData && <MapVideos mapData={mapData} />}
          </div>

          <TabsSection
            selectedFps={selectedFps}
            hasMoreTops={hasMoreTops}
            topsLoadMoreRef={topsLoadMoreRef}
            showingAllTops={showingAllTops}
          />
        </div>
      </main>
    </div>
  );
};

export default MapDetailPage;

const breadcrumbLabels = (mapName) => ["Home", "Maps", mapName || "Map"];
const breadcrumbPaths = [
  { index: 0, path: "/" },
  { index: 1, path: "/maps" },
];

const FPS_QUERY_VALUES = new Set([
  "all",
  "125",
  "250",
  "333",
  "43",
  "76",
  "mix",
]);

function normalizeFpsQuery(fpsValue) {
  const value = String(fpsValue || "125").toLowerCase();
  if (!FPS_QUERY_VALUES.has(value)) return "125";
  return value === "all" ? "All" : value;
}
