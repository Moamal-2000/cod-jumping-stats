"use client";

import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./MapServerSelector.module.scss";

const MapServerSelector = () => {
  const { queryName, defaultUrlQuery, filtersData } = MAP_SERVER_SELECTOR_DATA;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const sourceParam = searchParams.get("source") || "jh";

  function handleSwitchServer(queryValue) {
    if (queryValue === defaultUrlQuery) {
      removeQueryString(queryName, searchParams, router, pathname);
      return;
    }

    createQueryString(queryName, queryValue, searchParams, router, pathname);
  }

  return (
    <nav className={s.selectorContainer}>
      <p className={s.label}>Map on server</p>

      <div className={s.serverOptions}>
        {filtersData.map(({ text, queryValue }) => {
          const isActive = queryValue === sourceParam;

          return (
            <button
              type="button"
              key={queryValue}
              className={isActive ? s.active : ""}
              onClick={() => handleSwitchServer(queryValue)}
              aria-pressed={isActive}
            >
              {text}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default MapServerSelector;

const MAP_SERVER_SELECTOR_DATA = {
  queryName: "source",
  defaultUrlQuery: "jh",
  filtersData: [
    { text: "Jumpers Heaven", queryValue: "jh", id: 1 },
    { text: "Jump 4 Life", queryValue: "j4l", id: 2 },
  ],
};
