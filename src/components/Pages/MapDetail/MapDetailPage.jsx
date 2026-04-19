"use client";

import { normalizeFpsQuery } from "@/components/Footer/formatting";
import Breadcrumbs from "@/components/Shared/Breadcrumbs/Breadcrumbs";
import {
  fetchMapPlayers,
  fetchMapTops,
} from "@/redux/features/map/thunk/mapThunk";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapDetailHeader from "./MapDetailHeader/MapDetailHeader";
import MapDetailInfo from "./MapDetailInfo/MapDetailInfo";
import s from "./MapDetailPage.module.scss";
import MapVideos from "./MapVideos/MapVideos";
import PageLoadingError from "./PageLoadingError/PageLoadingError";
import TabsSection from "./TabsSection/TabsSection";

const MapDetailPage = ({ cpId }) => {
  const { allMaps, loading, error } = useSelector((s) => s.maps);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const mapData = allMaps.find((map) => map.CpID === +cpId);

  const selectedFps = normalizeFpsQuery(searchParams.get("fps"));
  const activeTab = searchParams.get("tab") || "tops";

  useEffect(() => {
    if (cpId && allMaps.length <= 0) {
      dispatch(fetchMaps());
    }

    if (activeTab === "tops" && cpId) {
      dispatch(fetchMapTops({ fps: selectedFps, cpId }));
    }

    if (activeTab === "players" && mapData?.ID) {
      dispatch(fetchMapPlayers({ fps: selectedFps, mapId: mapData.ID }));
    }
  }, [activeTab, selectedFps]);

  if (loading || error || !mapData) {
    return (
      <PageLoadingError loading={loading} error={error} mapData={mapData} />
    );
  }

  return (
    <div className="container">
      <main className={s.mapDetailPage}>
        <Breadcrumbs
          labels={breadcrumbLabels(mapData?.Name)}
          paths={breadcrumbPaths}
        />

        <MapDetailHeader mapData={mapData} />

        <div className={s.contentGrid}>
          <div className={s.leftColumn}>
            <MapDetailInfo mapData={mapData} />
            <MapVideos mapData={mapData} />
          </div>

          <TabsSection />
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
