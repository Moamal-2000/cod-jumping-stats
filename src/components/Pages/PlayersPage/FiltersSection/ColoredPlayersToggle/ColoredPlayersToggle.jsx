"use client";

import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./ColoredPlayersToggle.module.scss";

const ColoredPlayersToggle = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const colorStatus = searchParams?.get("colorstatus") || "all";

  function handleColorStatusChange(status) {
    if (status === "all") {
      removeQueryString("colorstatus", searchParams, router, pathname);
    } else {
      createQueryString("colorstatus", status, searchParams, router, pathname);
    }
  }

  return (
    <div className={s.filterGroup}>
      <span className={s.filterLabel}>Player Colors</span>
      <div
        className={s.toggleGroup}
        role="group"
        aria-label="Filter by player color status"
      >
        <button
          type="button"
          onClick={() => handleColorStatusChange("all")}
          className={`${s.toggleButton} ${colorStatus === "all" ? s.active : ""}`}
          aria-pressed={colorStatus === "all"}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => handleColorStatusChange("colored")}
          className={`${s.toggleButton} ${colorStatus === "colored" ? s.active : ""}`}
          aria-pressed={colorStatus === "colored"}
        >
          Colored
        </button>
        <button
          type="button"
          onClick={() => handleColorStatusChange("non-colored")}
          className={`${s.toggleButton} ${colorStatus === "non-colored" ? s.active : ""}`}
          aria-pressed={colorStatus === "non-colored"}
        >
          Non-Colored
        </button>
      </div>
    </div>
  );
};

export default ColoredPlayersToggle;
