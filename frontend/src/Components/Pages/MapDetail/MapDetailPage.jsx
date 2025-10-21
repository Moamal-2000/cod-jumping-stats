"use client";

import { jhApis } from "@/Api/jumpersHeaven";
import Breadcrumbs from "@/Components/Shared/Breadcrumbs/Breadcrumbs";
import SpinnerLoader from "@/Components/Shared/Loaders/SpinnerLoader/SpinnerLoader";
import { MAPS_CACHE_EXPIRATION_TIME } from "@/Data/constants";
import {
  cacheMapsLocally,
  decodeAsyncData,
  fetchMsgPackResponse,
} from "@/Functions/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MapDetailHeader from "./MapDetailHeader/MapDetailHeader";
import MapDetailInfo from "./MapDetailInfo/MapDetailInfo";
import s from "./MapDetailPage.module.scss";
import MapDetailPlayers from "./MapDetailPlayers/MapDetailPlayers";
import MapDetailTops from "./MapDetailTops/MapDetailTops";

const breadcrumbLabels = (mapName) => ["Home", "Maps", mapName || "Map"];
const breadcrumbPaths = [
  { index: 0, path: "/" },
  { index: 1, path: "/maps" },
];

const MapDetailPage = () => {
  const searchParams = useSearchParams();
  const cpid = +searchParams.get("mapid");

  const router = useRouter();
  const [mapData, setMapData] = useState(null);
  const [topsData, setTopsData] = useState(null);
  const [playersData, setPlayersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTops, setLoadingTops] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFps, setSelectedFps] = useState("125");
  const [activeTab, setActiveTab] = useState("tops"); // "tops" or "players"

  // Pagination state
  const [topsPage, setTopsPage] = useState(1);
  const [playersPage, setPlayersPage] = useState(1);
  const [hasMoreTops, setHasMoreTops] = useState(true);
  const [hasMorePlayers, setHasMorePlayers] = useState(true);
  const [loadingMoreTops, setLoadingMoreTops] = useState(false);
  const [loadingMorePlayers, setLoadingMorePlayers] = useState(false);

  // Track displayed items count for "All" FPS
  const [displayedTopsCount, setDisplayedTopsCount] = useState(0);
  const [displayedPlayersCount, setDisplayedPlayersCount] = useState(0);

  // Track if showing all items
  const [showingAllTops, setShowingAllTops] = useState(false);
  const [showingAllPlayers, setShowingAllPlayers] = useState(false);

  // Refs for infinite scroll
  const topsLoadMoreRef = useRef(null);
  const playersLoadMoreRef = useRef(null);

  // Store all fetched data for "All" FPS case
  const [allTopsData, setAllTopsData] = useState(null);
  const [allPlayersData, setAllPlayersData] = useState(null);

  const fpsOptions = ["All", "125", "250", "333", "43", "76", "mix"];
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (cpid) {
      fetchMapData();
    }
  }, [cpid]);

  useEffect(() => {
    if (mapData) {
      // Reset pagination when FPS changes
      setTopsPage(1);
      setPlayersPage(1);
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
    }
  }, [mapData, selectedFps]);

  const fetchMapData = async () => {
    let mapsLocal = localStorage.getItem("mapsData");

    if (mapsLocal) {
      const cachedData = JSON.parse(mapsLocal);
      const isCacheExpire =
        Date.now() - cachedData.timeStamp > MAPS_CACHE_EXPIRATION_TIME;

      if (!isCacheExpire) {
        const map = cachedData.maps.find((map) => map.CpID === parseInt(cpid));

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
  };

  const fetchTopsData = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMoreTops(true);
      } else {
        setLoadingTops(true);
      }

      if (selectedFps === "All") {
        // For "All" FPS, fetch all data once and paginate client-side
        if (!isLoadMore) {
          // First time loading - fetch all data from all FPS
          const allFps = ["125", "250", "333", "43", "76"];
          const promises = allFps.map((fps) =>
            fetch(jhApis({ fps, cpid }).map.getTops)
              .then((res) => res.json())
              .then((data) => {
                // Add FPS information to each run record
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

          // Show first page
          const firstPage = allData.slice(0, ITEMS_PER_PAGE);
          setTopsData(firstPage);
          setHasMoreTops(allData.length > ITEMS_PER_PAGE);
          setDisplayedTopsCount(ITEMS_PER_PAGE);
        } else {
          // Load more - paginate through stored data
          const startIndex = displayedTopsCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allTopsData.slice(startIndex, endIndex);

          setTopsData((prev) => [...(prev || []), ...nextPage]);
          setHasMoreTops(endIndex < allTopsData.length);
          setDisplayedTopsCount(endIndex);
        }
      } else if (selectedFps === "mix") {
        // Mix FPS - use fps=0 in API call
        if (!isLoadMore) {
          const response = await fetch(jhApis({ fps: "0", cpid }).map.getTops);
          const data = await response.json();

          setAllTopsData(data);

          // Show first page
          const firstPage = data.slice(0, ITEMS_PER_PAGE);
          setTopsData(firstPage);
          setHasMoreTops(data.length > ITEMS_PER_PAGE);
          setDisplayedTopsCount(ITEMS_PER_PAGE);
        } else {
          // Load more - paginate through stored data
          const startIndex = displayedTopsCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allTopsData.slice(startIndex, endIndex);

          setTopsData((prev) => [...(prev || []), ...nextPage]);
          setHasMoreTops(endIndex < allTopsData.length);
          setDisplayedTopsCount(endIndex);
        }
      } else {
        // Single FPS - fetch all data and paginate client-side
        if (!isLoadMore) {
          const response = await fetch(
            jhApis({ fps: selectedFps, cpid }).map.getTops
          );
          const data = await response.json();

          setAllTopsData(data);

          // Show first page
          const firstPage = data.slice(0, ITEMS_PER_PAGE);
          setTopsData(firstPage);
          setHasMoreTops(data.length > ITEMS_PER_PAGE);
          setDisplayedTopsCount(ITEMS_PER_PAGE);
        } else {
          // Load more - paginate through stored data
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
  };

  const fetchPlayersData = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMorePlayers(true);
      } else {
        setLoadingPlayers(true);
      }

      if (selectedFps === "All") {
        // For "All" FPS, fetch all data once and paginate client-side
        if (!isLoadMore) {
          // First time loading - fetch all data from all FPS
          const allFps = ["125", "250", "333", "43", "76"];
          const promises = allFps.map((fps) =>
            fetch(jhApis({ fps, mapid: mapData?.ID }).player.getPlayersPlayTime)
              .then((res) => res.json())
              .then((data) => {
                // Add FPS information to each player record
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

          // Group by player and sum playtime, preserving FPS information
          const playerMap = new Map();
          combinedData.forEach((player) => {
            const key = player.player_id;
            if (playerMap.has(key)) {
              const existingPlayer = playerMap.get(key);
              existingPlayer.time_played += player.time_played;
              // Add FPS to the list if not already present
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

          // Show first page
          const firstPage = allData.slice(0, ITEMS_PER_PAGE);
          setPlayersData(firstPage);
          setHasMorePlayers(allData.length > ITEMS_PER_PAGE);
          setDisplayedPlayersCount(ITEMS_PER_PAGE);
        } else {
          // Load more - paginate through stored data
          const startIndex = displayedPlayersCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allPlayersData.slice(startIndex, endIndex);

          setPlayersData((prev) => [...(prev || []), ...nextPage]);
          setHasMorePlayers(endIndex < allPlayersData.length);
          setDisplayedPlayersCount(endIndex);
        }
      } else if (selectedFps === "mix") {
        // Mix FPS - use fps=0 in API call
        if (!isLoadMore) {
          const response = await fetch(
            jhApis({ fps: "0", mapid: mapData?.ID }).player.getPlayersPlayTime
          );
          const data = await response.json();

          setAllPlayersData(data);

          // Show first page
          const firstPage = data.slice(0, ITEMS_PER_PAGE);
          setPlayersData(firstPage);
          setHasMorePlayers(data.length > ITEMS_PER_PAGE);
          setDisplayedPlayersCount(ITEMS_PER_PAGE);
        } else {
          // Load more - paginate through stored data
          const startIndex = displayedPlayersCount;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const nextPage = allPlayersData.slice(startIndex, endIndex);

          setPlayersData((prev) => [...(prev || []), ...nextPage]);
          setHasMorePlayers(endIndex < allPlayersData.length);
          setDisplayedPlayersCount(endIndex);
        }
      } else {
        // Single FPS - fetch all data and paginate client-side
        if (!isLoadMore) {
          const response = await fetch(
            jhApis({ fps: selectedFps, mapid: mapData?.ID }).player
              .getPlayersPlayTime
          );
          const data = await response.json();

          setAllPlayersData(data);

          // Show first page
          const firstPage = data.slice(0, ITEMS_PER_PAGE);
          setPlayersData(firstPage);
          setHasMorePlayers(data.length > ITEMS_PER_PAGE);
          setDisplayedPlayersCount(ITEMS_PER_PAGE);
        } else {
          // Load more - paginate through stored data
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
  };

  const handleFpsChange = (fps) => {
    setSelectedFps(fps);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const loadMoreTops = () => {
    if (!loadingMoreTops && hasMoreTops) {
      // Both "All" and individual FPS use direct call approach
      fetchTopsData(true);
    }
  };

  const loadMorePlayers = () => {
    if (!loadingMorePlayers && hasMorePlayers) {
      // Both "All" and individual FPS use direct call approach
      fetchPlayersData(true);
    }
  };

  const showAllTops = () => {
    if (allTopsData) {
      setTopsData(allTopsData);
      setShowingAllTops(true);
      setHasMoreTops(false);
    }
  };

  const showAllPlayers = () => {
    if (allPlayersData) {
      setPlayersData(allPlayersData);
      setShowingAllPlayers(true);
      setHasMorePlayers(false);
    }
  };

  // Infinite scroll effect for tops
  useEffect(() => {
    if (activeTab !== "tops" || !topsData || topsData.length === 0) return;

    const topsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreTops && !loadingMoreTops) {
          loadMoreTops();
        }
      },
      { threshold: 0.1 }
    );

    // Small delay to ensure DOM is ready
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

  // Infinite scroll effect for players
  useEffect(() => {
    if (activeTab !== "players" || !playersData || playersData.length === 0)
      return;

    const playersObserver = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMorePlayers &&
          !loadingMorePlayers
        ) {
          loadMorePlayers();
        }
      },
      { threshold: 0.1 }
    );

    // Small delay to ensure DOM is ready
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
            <button className={s.backButton} onClick={() => router.back()}>
              Go Back
            </button>
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
              onFpsChange={handleFpsChange}
              fpsOptions={fpsOptions}
            />
          </div>

          <div className={s.rightColumn}>
            <div className={s.tabContainer}>
              <div className={s.tabNavigation}>
                <button
                  className={`${s.tabButton} ${
                    activeTab === "tops" ? s.active : ""
                  }`}
                  onClick={() => handleTabChange("tops")}
                >
                  Top Runs
                </button>
                <button
                  className={`${s.tabButton} ${
                    activeTab === "players" ? s.active : ""
                  }`}
                  onClick={() => handleTabChange("players")}
                >
                  Most Played
                </button>
              </div>

              <div className={s.tabContent}>
                {activeTab === "tops" && (
                  <MapDetailTops
                    topsData={topsData}
                    selectedFps={selectedFps}
                    loading={loadingTops}
                    loadingMore={loadingMoreTops}
                    hasMore={hasMoreTops}
                    loadMoreRef={topsLoadMoreRef}
                    showingAll={showingAllTops}
                    onShowAll={showAllTops}
                    allData={allTopsData}
                  />
                )}

                {activeTab === "players" && (
                  <MapDetailPlayers
                    playersData={playersData}
                    selectedFps={selectedFps}
                    loading={loadingPlayers}
                    loadingMore={loadingMorePlayers}
                    hasMore={hasMorePlayers}
                    loadMoreRef={playersLoadMoreRef}
                    showingAll={showingAllPlayers}
                    onShowAll={showAllPlayers}
                    allData={allPlayersData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MapDetailPage;
