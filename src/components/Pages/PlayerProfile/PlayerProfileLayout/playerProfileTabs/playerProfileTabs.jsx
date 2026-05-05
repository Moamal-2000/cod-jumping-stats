"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import s from "./PlayerProfileTabs.module.scss";

const playerProfileTabs = [
  { id: "overview", label: "Overview", icon: "chart-bar" },
  { id: "tops", label: "Top Runs", icon: "star" },
  { id: "leaderboards", label: "Leaderboard Ranks", icon: "trophy" },
  { id: "routes", label: "Route Completion", icon: "check-circle" },
  { id: "runs-analytics", label: "Runs Analytics", icon: "line-chart" },
];

const tabIds = playerProfileTabs.map((tab) => tab.id);

const PlayerProfileTabs = ({ playerId }) => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const activeTab = tabIds.includes(currentTab) ? currentTab : "overview";

  return (
    <nav className={s.tabs} role="tablist">
      {playerProfileTabs.map((tab) => (
        <PlayerProfileTab
          key={tab.id}
          tab={tab}
          playerId={playerId}
          activeTab={activeTab}
        />
      ))}
    </nav>
  );
};

export default PlayerProfileTabs;

const PlayerProfileTab = ({ tab, playerId, activeTab }) => {
  const href = `/player/${playerId}${tab.id === "overview" ? "" : `?tab=${tab.id}`}`;
  const classes = `${s.tabButton} ${tab.id === activeTab ? s.active : ""}`;

  return (
    <Link
      href={href}
      key={tab.id}
      className={classes}
      role="tab"
      tabIndex={tab.id === activeTab ? 0 : -1}
    >
      <svg aria-hidden="true">
        <use href={`/icons-sprite.svg#${tab.icon}`} />
      </svg>
      {tab.label}
    </Link>
  );
};
