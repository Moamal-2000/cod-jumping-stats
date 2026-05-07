"use client";

import { HORIZONTAL_NAV_KEYS } from "@/data/constants";
import { useKeyListeners } from "@/hooks/helper/useKeyListeners";
import { getNextTabIndex, getPrevTabIndex } from "@/lib/utils";
import { updatePlayerProfileState } from "@/redux/features/playerProfile/slice/playerProfileSlice";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const focusedProfileTab = useSelector(
    (s) => s.playerProfile.focusedProfileTab,
  );

  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab");
  const activeTab = tabIds.includes(currentTab) ? currentTab : "overview";

  const tabsWrapperRef = useRef(null);
  const tabsRef = useRef([]);

  function keyHandler(event) {
    if (HORIZONTAL_NAV_KEYS.includes(event.key)) {
      focusTabWithArrowKeys(event, focusedProfileTab, tabsRef, dispatch);
    }
  }

  useKeyListeners({
    ref: tabsWrapperRef,
    listeners: {
      ArrowLeft: keyHandler,
      ArrowRight: keyHandler,
      Home: keyHandler,
      End: keyHandler,
    },
    options: {
      preventDefault: true,
    },
  });

  return (
    <nav
      className={s.tabs}
      role="tablist"
      ref={tabsWrapperRef}
      aria-orientation="horizontal"
    >
      {playerProfileTabs.map((tab, index) => (
        <PlayerProfileTab
          key={tab.id}
          tab={tab}
          playerId={playerId}
          activeTab={activeTab}
          tabsRef={tabsRef}
          index={index}
        />
      ))}
    </nav>
  );
};

export default PlayerProfileTabs;

const PlayerProfileTab = ({ tab, playerId, activeTab, tabsRef, index }) => {
  const isActive = tab.id === activeTab;

  const href = `/player/${playerId}${tab.id === "overview" ? "" : `?tab=${tab.id}`}`;
  const classes = `${s.tabButton} ${isActive ? s.active : ""}`;

  return (
    <Link
      href={href}
      key={tab.id}
      className={classes}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      ref={(el) => (tabsRef.current[index] = el)}
      id={`player-profile-tab-${tab.id}`}
      aria-selected={isActive}
      aria-controls={`player-profile-panel-${tab.id}`}
    >
      <svg aria-hidden="true">
        <use href={`/icons-sprite.svg#${tab.icon}`} />
      </svg>
      {tab.label}
    </Link>
  );
};

function focusTabWithArrowKeys(event, focusedTabOrder, tabsRef, dispatch) {
  if (focusedTabOrder === null) {
    return;
  }

  const tabs = tabsRef.current;
  const key = event.key;

  const nextFocusedTabOrder = getNextFocusedTabOrder({
    key,
    focusedTabOrder,
    tabs,
  });

  if (nextFocusedTabOrder === null) {
    return;
  }

  dispatch(
    updatePlayerProfileState({
      key: "focusedProfileTab",
      value: nextFocusedTabOrder,
    }),
  );
  tabs[nextFocusedTabOrder].focus();
}

const tabsKeyMap = { ArrowRight: "next", ArrowLeft: "prev" };

function getNextFocusedTabOrder({ key, focusedTabOrder, tabs }) {
  const lastIndex = tabs.length - 1;

  if (key === "Home") {
    return 0;
  }
  if (key === "End") {
    return lastIndex;
  }

  const direction = tabsKeyMap[key];

  if (direction === "next") {
    return getNextTabIndex(focusedTabOrder, tabs.length);
  }
  if (direction === "prev") {
    return getPrevTabIndex(focusedTabOrder, tabs.length);
  }

  return null;
}
