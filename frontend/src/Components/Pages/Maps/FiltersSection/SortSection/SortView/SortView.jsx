"use client";

import { createQueryString, removeQueryString } from "@/Functions/utils";
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
      <div className={s.buttonsWrapper}>
        <ShowAllButton setPaginationNumber={setPaginationNumber} />
        <ExpandButton />
      </div>

      <div className={s.buttonsWrapper}>
        {VIEW_OPTIONS_DATA.map(({ value, icon, id }) => {
          const activeClass = urlQuery === value ? s.active : "";

          return (
            <button
              key={id}
              type="button"
              className={`${s.sortViewBtn} ${activeClass}`}
              onClick={() => changeView(value)}
              title={`Change maps view to ${value}`}
            >
              <span>
                <svg>
                  <use href={`/badgesIcons.svg#${icon}`} />
                </svg>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortView;

const VIEW_OPTIONS_DATA = [
  {
    value: "grid",
    icon: "window",
    id: 1,
  },
  {
    value: "list",
    icon: "list",
    id: 2,
  },
];
