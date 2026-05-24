"use client";

import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./LastSeenDateFilter.module.scss";

const LastSeenDateFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const lastSeenParam = searchParams?.get("lastseen") || "";

  function handleLastSeenChange(value) {
    if (value === "") {
      removeQueryString("lastseen", searchParams, router, pathname);
    } else {
      createQueryString("lastseen", value, searchParams, router, pathname);
    }
  }

  return (
    <div className={s.filterGroup}>
      <label htmlFor="last-seen-filter" className={s.filterLabel}>
        Last Seen
      </label>
      <select
        id="last-seen-filter"
        value={lastSeenParam}
        onChange={(e) => handleLastSeenChange(e.target.value)}
        className={s.select}
      >
        <option value="">All Players</option>
        <option value="today">Today</option>
        <option value="this-week">This Week</option>
        <option value="this-month">This Month</option>
        <option value="this-year">This Year</option>
      </select>
    </div>
  );
};

export default LastSeenDateFilter;
