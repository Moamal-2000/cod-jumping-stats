"use client";

import {
  bugHunterIds,
  contentCreators,
  eventWinnerIds,
  mappersIds,
} from "@/data/manualBadges";
import { createQueryString } from "@/lib/queryParams";
import { isActiveWithinWeek } from "@/lib/validation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import s from "./BadgeStats.module.scss";

const BadgeStats = () => {
  const allPlayersData = useSelector((s) => s.players.allPlayersData);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filterBy = searchParams?.get("badge") || "all";

  function handleFilterChange(urlQuery) {
    createQueryString("badge", urlQuery, searchParams, router, pathname);
  }

  return (
    <div className={s.badgesCountContainer}>
      {getBadgesCount(allPlayersData).map((badge) => (
        <button
          type="button"
          key={badge.id}
          className={`${s.badgeButton} ${filterBy === badge.urlQuery ? s.active : ""}`}
          aria-pressed={filterBy === badge.urlQuery}
          onClick={() => handleFilterChange(badge.urlQuery)}
        >
          <span className={s.badgeLabel}>{badge.label}</span>
          <span className={s.badgeValue}>{badge.count}</span>
        </button>
      ))}
    </div>
  );
};

export default BadgeStats;

function getBadgesCount(allPlayersData) {
  return [
    {
      id: "all",
      label: "Total Players",
      count: allPlayersData.length,
      urlQuery: "all",
    },
    {
      id: "winner",
      label: "Event Winners",
      count: eventWinnerIds.length,
      urlQuery: "winner",
    },
    {
      id: "bugHunter",
      label: "Bug Hunters",
      count: bugHunterIds.length,
      urlQuery: "bug-hunter",
    },
    {
      id: "admin",
      label: "Admins",
      count: allPlayersData.filter((player) => player.Admin >= 100).length,
      urlQuery: "admin",
    },
    {
      id: "mapper",
      label: "Mappers",
      count: mappersIds.length,
      urlQuery: "mapper",
    },
    {
      id: "creator",
      label: "Content Creators",
      count: contentCreators.length,
      urlQuery: "creator",
    },
    {
      id: "donator",
      label: "Donators",
      count: allPlayersData.filter((player) => player.Donated === 1).length,
      urlQuery: "donator",
    },
    {
      id: "active",
      label: "Active Players",
      count: allPlayersData.filter((player) =>
        isActiveWithinWeek(player.LastSeen),
      ).length,
      urlQuery: "active",
    },
    {
      id: "banned",
      label: "Banned",
      count: allPlayersData.filter((player) => player.Banned === 1).length,
      urlQuery: "banned",
    },
  ];
}
