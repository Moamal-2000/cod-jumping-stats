"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import s from "./playerProfileTabs.module.scss";

const tabs = [
  { id: "overview", label: "Overview", icon: "chart-bar" },
  { id: "tops", label: "Top Runs", icon: "star" },
  { id: "leaderboards", label: "Leaderboard Ranks", icon: "trophy" },
  { id: "routes", label: "Route Completion", icon: "check-circle" },
  { id: "runs-analytics", label: "Runs Analytics", icon: "line-chart" },
];

const playerProfileTabs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const playerId = +searchParams.get("playerid");

  return (
    <nav className={s.tabs}>
      {tabs.map((tab) => (
        <PlayerProfileTab
          key={tab.id}
          tab={tab}
          playerId={playerId}
          pathname={pathname}
        />
      ))}
    </nav>
  );
};

export default playerProfileTabs;

const PlayerProfileTab = ({ tab, playerId, pathname }) => {
  const tabPath = tab.id === "overview" ? "" : tab.id;
  const href = `/player/${tabPath}?playerid=${playerId}`;
  const currentTab = pathname.split("/player")[1].slice(1) || tabs[0].id;
  const classes = `${s.tabButton} ${tab.id === currentTab ? s.active : ""}`;

  return (
    <Link href={href} key={tab.id} className={classes}>
      <svg aria-hidden="true">
        <use href={`/icons-sprite.svg#${tab.icon}`} />
      </svg>
      {tab.label}
    </Link>
  );
};
