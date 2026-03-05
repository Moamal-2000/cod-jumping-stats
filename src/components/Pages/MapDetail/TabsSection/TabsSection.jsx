"use client";

import { createQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MapDetailPlayers from "../MapDetailPlayers/MapDetailPlayers";
import MapDetailTops from "../MapDetailTops/MapDetailTops";
import s from "./TabsSection.module.scss";

const TabsSection = ({
  playersData,
  selectedFps,
  hasMoreTops,
  topsLoadMoreRef,
  showingAllTops,
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
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              className={`${s.tabButton} ${activeTab === id ? s.active : ""}`}
              onClick={() => handleUpdateTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={s.tabContent}>
          {activeTab === "tops" && (
            <MapDetailTops
              selectedFps={selectedFps}
              hasMore={hasMoreTops}
              loadMoreRef={topsLoadMoreRef}
              showingAll={showingAllTops}
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

const tabs = [
  {
    id: "tops",
    label: "Top Runs",
  },
  {
    id: "players",
    label: "Most Played",
  },
];
