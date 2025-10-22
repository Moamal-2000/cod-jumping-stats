"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import s from "./playerProfileTabs.module.scss";

const tabs = [
  { id: "overview", label: "Overview", icon: "chart-bar" },
  { id: "tops", label: "Top Runs", icon: "star" },
  { id: "leaderboards", label: "Leaderboard Ranks", icon: "trophy" },
  { id: "routes", label: "Route Completion", icon: "check-circle" },
];

const playerProfileTabs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const playerId = +searchParams.get("playerid");

  return (
    <div className={s.tabs}>
      {tabs.map((tab) => {
        const currentTab = pathname.split("/player")[1].slice(1) || tabs[0].id;

        return (
          <Link
            href={`/player/${
              tab.id === "overview" ? "" : tab.id
            }?playerid=${playerId}`}
            key={tab.id}
            className={`${s.tabButton} ${
              tab.id === currentTab ? s.active : ""
            }`}
          >
            <svg>
              <use href={`/icons-sprite.svg#${tab.icon}`} />
            </svg>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default playerProfileTabs;
