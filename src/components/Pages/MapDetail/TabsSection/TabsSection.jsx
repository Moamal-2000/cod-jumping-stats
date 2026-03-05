"use client";

import { normalizeFpsQuery } from "@/components/Footer/formatting";
import { createQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MapDetailPlayers from "../MapDetailPlayers/MapDetailPlayers";
import MapDetailTops from "../MapDetailTops/MapDetailTops";
import s from "./TabsSection.module.scss";

const TabsSection = ({ showingAllTops }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") || "tops";
  const selectedFps = normalizeFpsQuery(searchParams.get("fps"));

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
              showingAll={showingAllTops}
            />
          )}

          {activeTab === "players" && (
            <MapDetailPlayers selectedFps={selectedFps} />
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
