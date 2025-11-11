"use client";

import { jhApis } from "@/Api/jumpersHeaven";
import Breadcrumbs from "@/Components/Shared/Breadcrumbs/Breadcrumbs";
import SpinnerLoader from "@/Components/Shared/Loaders/SpinnerLoader/SpinnerLoader";
import { JUMP_FPS, MAPS_CACHE_EXPIRATION_TIME } from "@/Data/constants";
import {
  cacheMapsLocally,
  decodeAsyncData,
  fetchMsgPackResponse,
  getCachedMaps,
} from "@/Functions/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MapDetailHeader from "./MapDetailHeader/MapDetailHeader";
import MapDetailInfo from "./MapDetailInfo/MapDetailInfo";
import s from "./MapDetailPage.module.scss";
import MapVideos from "./MapVideos/MapVideos";
import TabsSection from "./TabsSection/TabsSection";

const breadcrumbLabels = (mapName) => ["Home", "Maps", mapName || "Map"];
const breadcrumbPaths = [
  { index: 0, path: "/" },
  { index: 1, path: "/maps" },
];

const ITEMS_PER_PAGE = 10;

const MapDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cpid = +searchParams.get("mapid");

  const [mapData, setMapData] = useState(null);
  const [topsData, setTopsData] = useState(null);
  const [playersData, setPlayersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedFps, setSelectedFps] = useState("125");

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

  async function fetchMapData() {
    let mapsLocal = getCachedMaps();

    if (mapsLocal !== null) {
      const cacheAge = Date.now() - parseInt(mapsLocal.timeStamp);
      const isCacheExpire = cacheAge > MAPS_CACHE_EXPIRATION_TIME;

      if (!isCacheExpire) {
        const map = mapsLocal.maps.find((map) => map.CpID === parseInt(cpid));

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
        url: jhApis().map.getAllMaps,
      });

      mapsLocal = await decodeAsyncData(response);
      cacheMapsLocally(mapsLocal);

      const map = mapsLocal.find((map) => map.CpID === parseInt(cpid));

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
            fetch(jhApis({ fps, cpid }).map.getTops)
              .then((res) => res.json())
              .then((data) => {
                if (Array.isArray(data)) {
                  return data.map((run) => ({ ...run, fps }));
                }
                return [];
              })
              .catch((err) => {
                console.warn(`Error fetching tops for ${fps} FPS:`, err);
                return [];
              })
          );

          const results = await Promise.all(promises);
          const allData = results
            .filter((result) => Array.isArray(result))
            .flat()
            .filter(
              (item) =>
                item &&
                typeof item === "object" &&
                item.time_played !== null &&
                item.time_played !== undefined
            )
            .sort((a, b) => a.time_played - b.time_played);

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
          const response = await fetch(jhApis({ fps: "0", cpid }).map.getTops);
          const data = await response.json();

          setAllTopsData(data);

          const firstPage = data.slice(0, ITEMS_PER_PAGE);
          setTopsData(firstPage);
          setHasMoreTops(data.length > ITEMS_PER_PAGE);
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
          const response = await fetch(
            jhApis({ fps: selectedFps, cpid }).map.getTops
          );
          const data = await response.json();

          setAllTopsData(data);

          const firstPage = data.slice(0, ITEMS_PER_PAGE);
          setTopsData(firstPage);
          setHasMoreTops(data.length > ITEMS_PER_PAGE);
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
            fetch(jhApis({ fps, mapid: mapData?.ID }).player.getPlayersPlayTime)
              .then((res) => res.json())
              .then((data) => {
                if (Array.isArray(data)) {
                  return data.map((player) => ({ ...player, fps }));
                }
                return [];
              })
              .catch((err) => {
                console.warn(`Error fetching players for ${fps} FPS:`, err);
                return [];
              })
          );

          const results = await Promise.all(promises);
          const combinedData = results
            .filter((result) => Array.isArray(result))
            .flat()
            .filter(
              (player) =>
                player &&
                typeof player === "object" &&
                player.player_id &&
                player.time_played !== null &&
                player.time_played !== undefined
            );

          const playerMap = new Map();
          combinedData.forEach((player) => {
            const key = player.player_id;
            if (playerMap.has(key)) {
              const existingPlayer = playerMap.get(key);
              existingPlayer.time_played += player.time_played;
              if (!existingPlayer.fps_list) {
                existingPlayer.fps_list = [existingPlayer.fps];
              }
              if (!existingPlayer.fps_list.includes(player.fps)) {
                existingPlayer.fps_list.push(player.fps);
              }
            } else {
              playerMap.set(key, {
                ...player,
                fps_list: [player.fps],
              });
            }
          });

          const allData = Array.from(playerMap.values()).sort(
            (a, b) => b.time_played - a.time_played
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
          const response = await fetch(
            jhApis({ fps: "0", mapid: mapData?.ID }).player.getPlayersPlayTime
          );
          const data = await response.json();

          setAllPlayersData(data);

          const firstPage = data.slice(0, ITEMS_PER_PAGE);
          setPlayersData(firstPage);
          setHasMorePlayers(data.length > ITEMS_PER_PAGE);
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
          const response = await fetch(
            jhApis({ fps: selectedFps, mapid: mapData?.ID }).player
              .getPlayersPlayTime
          );
          const data = await response.json();

          setAllPlayersData(data);

          const firstPage = data.slice(0, ITEMS_PER_PAGE);
          setPlayersData(firstPage);
          setHasMorePlayers(data.length > ITEMS_PER_PAGE);
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
      { threshold: 0.1 }
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
      { threshold: 0.1 }
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
    if (cpid) fetchMapData();
  }, [cpid]);

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

  if (loading) {
    return (
      <main className={s.mapDetailPage}>
        <div className="container">
          <SpinnerLoader
            title="Loading map details..."
            description="Fetching map information and statistics"
          />
        </div>
      </main>
    );
  }

  if (error || !mapData) {
    return (
      <main className={s.mapDetailPage}>
        <div className="container">
          <div className={s.errorContainer}>
            <h2>Map Not Found</h2>
            <p>The requested map could not be found.</p>
            <Link href="/maps" className={s.backButton}>
              Go Maps Page
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={s.mapDetailPage}>
      <div className="container">
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
              onFpsChange={setSelectedFps}
            />
            {mapData && <MapVideos mapId={mapData.CpID} />}
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
      </div>
    </main>
  );
};

export default MapDetailPage;
