"use client";

import { jhApis } from "@/api/jumpersHeaven";
import Breadcrumbs from "@/components/Shared/Breadcrumbs/Breadcrumbs";
import { JUMP_FPS, MAPS_CACHE_EXPIRATION_TIME } from "@/data/constants";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";
import { cacheMapsLocally, getCachedMaps } from "@/lib/localCache";
import { createQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MapDetailHeader from "./MapDetailHeader/MapDetailHeader";
import MapDetailInfo from "./MapDetailInfo/MapDetailInfo";
import s from "./MapDetailPage.module.scss";
import MapVideos from "./MapVideos/MapVideos";
import PageLoadingError from "./PageLoadingError/PageLoadingError";
import TabsSection from "./TabsSection/TabsSection";

const MapDetailPage = ({ cpId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedFps = normalizeFpsQuery(searchParams.get("fps"));

  const [mapData, setMapData] = useState(null);
  const [topsData, setTopsData] = useState(null);
  const [playersData, setPlayersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [hasMoreTops, setHasMoreTops] = useState(true);
  const [hasMorePlayers, setHasMorePlayers] = useState(true);

  const [displayedTopsCount, setDisplayedTopsCount] = useState(0);
  const [displayedPlayersCount, setDisplayedPlayersCount] = useState(0);

  const topsLoadMoreRef = useRef(null);
  const playersLoadMoreRef = useRef(null);

  const [allTopsData, setAllTopsData] = useState(null);
  const [allPlayersData, setAllPlayersData] = useState(null);

  const [loadingTops, setLoadingTops] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const [showingAllTops, setShowingAllTops] = useState(false);
  const [showingAllPlayers, setShowingAllPlayers] = useState(false);

  const [loadingMoreTops, setLoadingMoreTops] = useState(false);
  const [loadingMorePlayers, setLoadingMorePlayers] = useState(false);

  const activeTab = searchParams.get("tab") || "tops";

  function handleFpsChange(nextFps) {
    const normalizedFps = normalizeFpsQuery(nextFps);
    if (normalizedFps === selectedFps) return;

    createQueryString("fps", normalizedFps, searchParams, router, pathname);
  }

  async function fetchMapData() {
    let mapsLocal = getCachedMaps();

    if (mapsLocal !== null) {
      const cacheAge = Date.now() - parseInt(mapsLocal.timeStamp, 10);
      const isCacheExpire = cacheAge > MAPS_CACHE_EXPIRATION_TIME;

      if (!isCacheExpire) {
        const map = mapsLocal.maps.find((map) => map.CpID === +cpId);

        setMapData(map);
        setError(false);
        setLoading(false);

        return;
      }
    }

    try {
      setLoading(true);
      setError(false);

      const response = await fetchMsgPackResponse({
        url: jhApis().map.allMaps,
      });

      mapsLocal = (await decodeAsyncData(response)) ?? [];
      if (mapsLocal.length > 0) cacheMapsLocally(mapsLocal);

      const map = mapsLocal.find((map) => map.CpID === +cpId);

      map ? setMapData(map) : setError(true);
    } catch (err) {
      console.error("Error fetching map data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTopsData(isLoadMore = false) {
    try {
      if (isLoadMore) setLoadingMoreTops(true);
      else setLoadingTops(true);

      if (selectedFps === "All") {
        if (!isLoadMore) {
          const promises = JUMP_FPS.map((fps) =>
            fetchMsgPackResponse({ url: jhApis({ fps, cpId }).map.tops })
              .then((response) => decodeAsyncData(response))
              .then((data) => {
                if (Array.isArray(data)) {
                  return data.map((run) => ({ ...run, FPS: run?.FPS ?? fps }));
                }
                return [];
              })
              .catch((err) => {
                console.warn(`Error fetching tops for ${fps} FPS:`, err);
                return [];
              }),
          );

          const results = await Promise.all(promises);
          const allData = results
            .filter((result) => Array.isArray(result))
            .flat()
            .filter(
              (item) =>
                item &&
                typeof item === "object" &&
                item.TimePlayed !== null &&
                item.TimePlayed !== undefined,
            )
            .sort((a, b) => a.TimePlayed - b.TimePlayed);

          setAllTopsData(allData);

          const firstPage = allData.slice(0, ITEMS_PER_PAGE);
          setTopsData(firstPage);
          setHasMoreTops(allData.length > ITEMS_PER_PAGE);
          setDisplayedTopsCount(ITEMS_PER_PAGE);
        } else {
          const startIndex = displayedTopsCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allTopsData.slice(startIndex, endIndex);

          setTopsData((prev) => [...(prev || []), ...nextPage]);
          setHasMoreTops(endIndex < allTopsData.length);
          setDisplayedTopsCount(endIndex);
        }
      } else if (selectedFps === "mix") {
        if (!isLoadMore) {
          const response = await fetchMsgPackResponse({
            url: jhApis({ fps: "0", cpId }).map.tops,
          });
          const data = (await decodeAsyncData(response)) ?? [];
          const normalizedData = Array.isArray(data) ? data : [];

          setAllTopsData(normalizedData);

          const firstPage = normalizedData.slice(0, ITEMS_PER_PAGE);
          setTopsData(firstPage);
          setHasMoreTops(normalizedData.length > ITEMS_PER_PAGE);
          setDisplayedTopsCount(ITEMS_PER_PAGE);
        } else {
          const startIndex = displayedTopsCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allTopsData.slice(startIndex, endIndex);

          setTopsData((prev) => [...(prev || []), ...nextPage]);
          setHasMoreTops(endIndex < allTopsData.length);
          setDisplayedTopsCount(endIndex);
        }
      } else {
        if (!isLoadMore) {
          const response = await fetchMsgPackResponse({
            url: jhApis({ fps: selectedFps, cpId }).map.tops,
          });
          const data = (await decodeAsyncData(response)) ?? [];
          const normalizedData = Array.isArray(data) ? data : [];

          setAllTopsData(normalizedData);

          const firstPage = normalizedData.slice(0, ITEMS_PER_PAGE);
          setTopsData(firstPage);
          setHasMoreTops(normalizedData.length > ITEMS_PER_PAGE);
          setDisplayedTopsCount(ITEMS_PER_PAGE);
        } else {
          const startIndex = displayedTopsCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allTopsData.slice(startIndex, endIndex);

          setTopsData((prev) => [...(prev || []), ...nextPage]);
          setHasMoreTops(endIndex < allTopsData.length);
          setDisplayedTopsCount(endIndex);
        }
      }
    } catch (err) {
      console.error("Error fetching tops data:", err);
      if (!isLoadMore) {
        setTopsData([]);
      }
    } finally {
      if (isLoadMore) {
        setLoadingMoreTops(false);
      } else {
        setLoadingTops(false);
      }
    }
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

  function loadMoreTops() {
    if (!loadingMoreTops && hasMoreTops) {
      fetchTopsData(true);
    }
  }

  function loadMorePlayers() {
    if (!loadingMorePlayers && hasMorePlayers) {
      fetchPlayersData(true);
    }
  }

  function showAllTops() {
    if (allTopsData) {
      setTopsData(allTopsData);
      setShowingAllTops(true);
      setHasMoreTops(false);
    }
  }

  function showAllPlayers() {
    if (!allPlayersData) return;

    setPlayersData(allPlayersData);
    setShowingAllPlayers(true);
    setHasMorePlayers(false);
  }

  useEffect(() => {
    if (activeTab !== "tops" || !topsData || topsData.length === 0) return;

    const topsObserver = new IntersectionObserver(
      (entries) => {
        const shouldLoadMore =
          entries[0].isIntersecting && hasMoreTops && !loadingMoreTops;
        if (shouldLoadMore) loadMoreTops();
      },
      { threshold: 0.1 },
    );

    const timeoutId = setTimeout(() => {
      if (topsLoadMoreRef.current) {
        topsObserver.observe(topsLoadMoreRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (topsLoadMoreRef.current) {
        topsObserver.unobserve(topsLoadMoreRef.current);
      }
    };
  }, [hasMoreTops, loadingMoreTops, activeTab, topsData]);

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
    if (cpId) fetchMapData();
  }, [cpId]);

  useEffect(() => {
    if (!mapData) return;

    setHasMoreTops(true);
    setHasMorePlayers(true);
    setTopsData(null);
    setPlayersData(null);
    setAllTopsData(null);
    setAllPlayersData(null);
    setDisplayedTopsCount(0);
    setDisplayedPlayersCount(0);
    setShowingAllTops(false);
    setShowingAllPlayers(false);

    fetchTopsData();
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
            topsData={topsData}
            playersData={playersData}
            selectedFps={selectedFps}
            loadingTops={loadingTops}
            loadingMoreTops={loadingMoreTops}
            hasMoreTops={hasMoreTops}
            topsLoadMoreRef={topsLoadMoreRef}
            showingAllTops={showingAllTops}
            showAllTops={showAllTops}
            allTopsData={allTopsData}
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
