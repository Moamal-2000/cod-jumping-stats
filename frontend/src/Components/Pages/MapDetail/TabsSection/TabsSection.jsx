"use client";

import { createQueryString } from "@/Functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MapDetailPlayers from "../MapDetailPlayers/MapDetailPlayers";
import MapDetailTops from "../MapDetailTops/MapDetailTops";
import s from "./TabsSection.module.scss";

const TabsSection = ({
  topsData,
  playersData,
  selectedFps,
  loadingTops,
  loadingMoreTops,
  hasMoreTops,
  topsLoadMoreRef,
  showingAllTops,
  showAllTops,
  allTopsData,
  loadingPlayers,
  loadingMorePlayers,
  hasMorePlayers,
  playersLoadMoreRef,
  showingAllPlayers,
  showAllPlayers,
  allPlayersData,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") || "tops";

  function handleUpdateTab(tab) {
    createQueryString("tab", tab, searchParams, router, pathname);
  }

  return (
    <div className={s.rightColumn}>
      <div className={s.tabContainer}>
        <div className={s.tabNavigation}>
          <button
            className={`${s.tabButton} ${activeTab === "tops" ? s.active : ""}`}
            onClick={() => handleUpdateTab("tops")}
          >
            Top Runs
          </button>
          <button
            className={`${s.tabButton} ${
              activeTab === "players" ? s.active : ""
            }`}
            onClick={() => handleUpdateTab("players")}
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
  );
};

export default TabsSection;
