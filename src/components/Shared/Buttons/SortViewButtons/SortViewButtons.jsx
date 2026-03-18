"use client";

import { VIEW_OPTIONS_DATA } from "@/data/constants";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./SortViewButtons.module.scss";

const SortViewButtons = ({
  defaultView = "grid",
  queryName = "view",
  themeColor = "green",
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const viewBy = searchParams.get(queryName) || defaultView;

  function changeView(value) {
    const isDefault = value === defaultView;

    if (isDefault) {
      removeQueryString(queryName, searchParams, router, pathname);
      return;
    }

    createQueryString(queryName, value, searchParams, router, pathname);
  }

  return (
    <div className={s.buttons}>
      {VIEW_OPTIONS_DATA.map(({ value, icon, id }) => {
        const activeClass = viewBy === value ? s.active : "";
        const title = `Change view to ${value}`;

        return (
          <button
            key={id}
            type="button"
            className={`${s.viewButton} ${activeClass} ${s[themeColor]}`}
            onClick={() => changeView(value)}
            title={title}
            aria-label={title}
          >
            <svg aria-hidden="true">
              <use href={`/icons-sprite.svg#${icon}`} />
            </svg>
          </button>
        );
      })}
    </div>
  );
};
export default SortViewButtons;
