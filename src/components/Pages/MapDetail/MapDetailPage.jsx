"use client";

import { jhApis } from "@/api/jumpersHeaven";
import Breadcrumbs from "@/components/Shared/Breadcrumbs/Breadcrumbs";
import { JUMP_FPS } from "@/data/constants";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";
import { createQueryString } from "@/lib/queryParams";
import { fetchMapTops } from "@/redux/features/map/thunk/mapThunk";
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
  const [playersData, setPlayersData] = useState(null);

  const [hasMoreTops, setHasMoreTops] = useState(true);
  const [hasMorePlayers, setHasMorePlayers] = useState(true);

  const [displayedPlayersCount, setDisplayedPlayersCount] = useState(0);

  const topsLoadMoreRef = useRef(null);
  const playersLoadMoreRef = useRef(null);

  const [allPlayersData, setAllPlayersData] = useState(null);

  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const [showingAllTops, setShowingAllTops] = useState(false);
  const [showingAllPlayers, setShowingAllPlayers] = useState(false);

  const [loadingMorePlayers, setLoadingMorePlayers] = useState(false);

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

  async function fetchPlayersData(isLoadMore = false) {
    try {
      if (isLoadMore) setLoadingMorePlayers(true);
      else setLoadingPlayers(true);

      if (selectedFps === "All") {
        if (!isLoadMore) {
          const promises = JUMP_FPS.map((fps) =>
            fetchMsgPackResponse({
              url: jhApis({ fps, mapid: mapData?.ID }).player.playersPlayTime,
            })
              .then((response) => decodeAsyncData(response))
              .then((data) => {
                if (Array.isArray(data)) {
                  return data.map((player) => ({
                    ...player,
                    FPS: player?.FPS ?? fps,
                  }));
                }
                return [];
              })
              .catch((err) => {
                console.warn(`Error fetching players for ${fps} FPS:`, err);
                return [];
              }),
          );

          const results = await Promise.all(promises);
          const combinedData = results
            .filter((result) => Array.isArray(result))
            .flat()
            .filter(
              (player) =>
                player &&
                typeof player === "object" &&
                player.PlayerID &&
                player.TimePlayed !== null &&
                player.TimePlayed !== undefined,
            );

          const playerMap = new Map();
          combinedData.forEach((player) => {
            const key = player.PlayerID;
            if (playerMap.has(key)) {
              const existingPlayer = playerMap.get(key);
              existingPlayer.TimePlayed += player.TimePlayed;
              if (!existingPlayer.FPSList) {
                existingPlayer.FPSList = [existingPlayer.FPS];
              }
              if (!existingPlayer.FPSList.includes(player.FPS)) {
                existingPlayer.FPSList.push(player.FPS);
              }
            } else {
              playerMap.set(key, {
                ...player,
                FPSList: [player.FPS],
              });
            }
          });

          const allData = Array.from(playerMap.values()).sort(
            (a, b) => b.TimePlayed - a.TimePlayed,
          );

          setAllPlayersData(allData);

          const firstPage = allData.slice(0, ITEMS_PER_PAGE);
          setPlayersData(firstPage);
          setHasMorePlayers(allData.length > ITEMS_PER_PAGE);
          setDisplayedPlayersCount(ITEMS_PER_PAGE);
        } else {
          const startIndex = displayedPlayersCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allPlayersData.slice(startIndex, endIndex);

          setPlayersData((prev) => [...(prev || []), ...nextPage]);
          setHasMorePlayers(endIndex < allPlayersData.length);
          setDisplayedPlayersCount(endIndex);
        }
      } else if (selectedFps === "mix") {
        if (!isLoadMore) {
          const response = await fetchMsgPackResponse({
            url: jhApis({ fps: "0", mapid: mapData?.ID }).player
              .playersPlayTime,
          });
          const data = (await decodeAsyncData(response)) ?? [];
          const normalizedData = Array.isArray(data) ? data : [];

          setAllPlayersData(normalizedData);

          const firstPage = normalizedData.slice(0, ITEMS_PER_PAGE);
          setPlayersData(firstPage);
          setHasMorePlayers(normalizedData.length > ITEMS_PER_PAGE);
          setDisplayedPlayersCount(ITEMS_PER_PAGE);
        } else {
          const startIndex = displayedPlayersCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allPlayersData.slice(startIndex, endIndex);

          setPlayersData((prev) => [...(prev || []), ...nextPage]);
          setHasMorePlayers(endIndex < allPlayersData.length);
          setDisplayedPlayersCount(endIndex);
        }
      } else {
        if (!isLoadMore) {
          const response = await fetchMsgPackResponse({
            url: jhApis({ fps: selectedFps, mapid: mapData?.ID }).player
              .playersPlayTime,
          });
          const data = (await decodeAsyncData(response)) ?? [];
          const normalizedData = Array.isArray(data) ? data : [];

          setAllPlayersData(normalizedData);

          const firstPage = normalizedData.slice(0, ITEMS_PER_PAGE);
          setPlayersData(firstPage);
          setHasMorePlayers(normalizedData.length > ITEMS_PER_PAGE);
          setDisplayedPlayersCount(ITEMS_PER_PAGE);
        } else {
          const startIndex = displayedPlayersCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allPlayersData.slice(startIndex, endIndex);

          setPlayersData((prev) => [...(prev || []), ...nextPage]);
          setHasMorePlayers(endIndex < allPlayersData.length);
          setDisplayedPlayersCount(endIndex);
        }
      }
    } catch (err) {
      console.error("Error fetching players data:", err);
      if (!isLoadMore) {
        setPlayersData([]);
      }
    } finally {
      if (isLoadMore) {
        setLoadingMorePlayers(false);
      } else {
        setLoadingPlayers(false);
      }
    }
  }

  function loadMorePlayers() {
    if (!loadingMorePlayers && hasMorePlayers) {
      fetchPlayersData(true);
    }
  }

  function showAllPlayers() {
    if (!allPlayersData) return;

    setPlayersData(allPlayersData);
    setShowingAllPlayers(true);
    setHasMorePlayers(false);
  }

  useEffect(() => {
    if (activeTab === "tops")
      dispatch(fetchMapTops({ fps: selectedFps, cpId }));
  }, [activeTab, selectedFps]);

  useEffect(() => {
    if (activeTab !== "players" || !playersData || playersData.length === 0)
      return;

    const playersObserver = new IntersectionObserver(
      (entries) => {
        const shouldLoadMore =
          entries[0].isIntersecting && hasMorePlayers && !loadingMorePlayers;
        if (shouldLoadMore) loadMorePlayers();
      },
      { threshold: 0.1 },
    );

    const timeoutId = setTimeout(() => {
      if (playersLoadMoreRef.current) {
        playersObserver.observe(playersLoadMoreRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (playersLoadMoreRef.current) {
        playersObserver.unobserve(playersLoadMoreRef.current);
      }
    };
  }, [hasMorePlayers, loadingMorePlayers, activeTab, playersData]);

  useEffect(() => {
    if (cpId) dispatch(fetchMaps());
  }, [cpId]);

  useEffect(() => {
    if (!mapData) return;

    setHasMoreTops(true);
    setHasMorePlayers(true);
    setPlayersData(null);
    setAllPlayersData(null);
    setDisplayedPlayersCount(0);
    setShowingAllTops(false);
    setShowingAllPlayers(false);

    fetchPlayersData();
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
            playersData={playersData}
            selectedFps={selectedFps}
            hasMoreTops={hasMoreTops}
            topsLoadMoreRef={topsLoadMoreRef}
            showingAllTops={showingAllTops}
            loadingPlayers={loadingPlayers}
            loadingMorePlayers={loadingMorePlayers}
            hasMorePlayers={hasMorePlayers}
            playersLoadMoreRef={playersLoadMoreRef}
            showingAllPlayers={showingAllPlayers}
            showAllPlayers={showAllPlayers}
            allPlayersData={allPlayersData}
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

const ITEMS_PER_PAGE = 10;
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
