"use client";

import { createQueryString, removeQueryString } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./FilterButton.module.scss";

export function FilterButton({
  text,
  queryName,
  queryValue,
  toolTip,
  urlQuery,
  defaultUrlQuery,
}) {
  const isRegionFilter = queryName === "region";
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const textValue = text?.toLowerCase();
  const regionValue = queryValue?.toLowerCase();
  const currentValue = urlQuery || defaultUrlQuery;

  const isActive = isRegionFilter
    ? regionValue === currentValue
    : currentValue === (queryValue?.toLowerCase() || textValue);

  const ariaLabel = isActive
    ? `The leaderboard currently filtered by ${text}`
    : `Filter the leaderboard by ${text}`;

  const handleClick = () => {
    const value = isRegionFilter
      ? regionValue
      : queryValue?.toLowerCase() || textValue;
    if (!value) return;

    const isDefault = value === defaultUrlQuery;

    if (isDefault) {
      removeQueryString(queryName, searchParams, router, pathname);
    } else {
      createQueryString(queryName, value, searchParams, router, pathname);
    }
  };

  return (
    <button
      type="button"
      className={`${s.button} ${isActive ? s.active : ""}`}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {toolTip && <p className={s.toolTip}>{toolTip}</p>}
      <span>{text}</span>
    </button>
  );
}

export default FilterButton;
