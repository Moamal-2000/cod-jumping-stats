"use client";

import { VIEW_OPTIONS_DATA } from "@/data/constants";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ExpandButton from "./ExpandButton/ExpandButton";
import ShowAllButton from "./ShowAllButton/ShowAllButton";
import s from "./SortView.module.scss";

const SortView = ({ setPaginationNumber }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlQuery = searchParams.get("view") || "grid";

  function changeView(value) {
    const isDefault = value === "grid";

    if (isDefault) {
      removeQueryString("view", searchParams, router, pathname);
      return;
    }

    createQueryString("view", value, searchParams, router, pathname);
  }

  return (
    <div className={s.sortViewWrapper}>
      <ShowAllButton setPaginationNumber={setPaginationNumber} />
      <ExpandButton />

      {VIEW_OPTIONS_DATA.map(({ value, icon, id }) => {
        const activeClass = urlQuery === value ? s.active : "";
        const title = `Change maps view to ${value}`;

        return (
          <button
            key={id}
            type="button"
            className={`${s.sortViewBtn} ${activeClass}`}
            onClick={() => changeView(value)}
            aria-label={title}
            title={title}
          >
            <span>
              <svg aria-hidden="true">
                <use href={`/icons-sprite.svg#${icon}`} />
              </svg>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SortView;
