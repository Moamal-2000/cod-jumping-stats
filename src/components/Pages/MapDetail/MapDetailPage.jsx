"use client";

import { normalizeFpsQuery } from "@/components/Footer/formatting";
import Breadcrumbs from "@/components/Shared/Breadcrumbs/Breadcrumbs";
import {
  fetchMapPlayers,
  fetchMapTops,
} from "@/redux/features/map/thunk/mapThunk";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapDetailHeader from "./MapDetailHeader/MapDetailHeader";
import MapDetailInfo from "./MapDetailInfo/MapDetailInfo";
import s from "./MapDetailPage.module.scss";
import MapVideos from "./MapVideos/MapVideos";
import PageLoadingError from "./PageLoadingError/PageLoadingError";
import TabsSection from "./TabsSection/TabsSection";

const MapDetailPage = ({ cpId }) => {
  const { allMaps, loading, error } = useSelector((s) => s.maps);
  const [showingAllTops, setShowingAllTops] = useState(false);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const mapData = allMaps.find((map) => map.CpID === +cpId);

  const selectedFps = normalizeFpsQuery(searchParams.get("fps"));
  const activeTab = searchParams.get("tab") || "tops";

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
            <MapDetailInfo mapData={mapData} />
            {mapData && <MapVideos mapData={mapData} />}
          </div>

          <TabsSection showingAllTops={showingAllTops} />
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
