"use client";

import { getStarsText } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./CheckboxButtons.module.scss";

const CheckboxButtons = ({ filtersData, queryName }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCheckboxes = searchParams.getAll(queryName);

  function handleChange(queryValue) {
    const params = new URLSearchParams(searchParams);
    const currentValues = params.getAll(queryName);
    const isChecked = currentValues.includes(queryValue);

    if (!isChecked) {
      params.append(queryName, queryValue);
    }

    if (isChecked) {
      const filtered = currentValues.filter((v) => v !== queryValue);
      params.delete(queryName);
      filtered.forEach((v) => params.append(queryName, v));
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={s.checkboxes}>
      {filtersData?.map(({ text, queryValue, id }) => {
        const isNumber = !Number.isNaN(+text);
        const modifiedText = isNumber ? getStarsText(text) : text;

        const isActive = selectedCheckboxes.includes(queryValue);

        return (
          <label
            key={id}
            className={`${s.checkboxLabel} ${isActive ? s.active : ""}`}
          >
            <input
              type="checkbox"
              value={queryValue}
              onChange={() => handleChange(queryValue)}
              checked={isActive}
            />
            <span className={s.checkboxMark} aria-hidden="true">
              <svg>
                <use href="/icons-sprite.svg#checked" />
              </svg>
            </span>
            <span className={s.checkboxText}>{modifiedText}</span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckboxButtons;

function getFilterBtnTitle(queryName, queryValue) {
  const value = String(queryValue)?.toLowerCase();

  switch (queryName) {
    case "map-difficulty":
      return `Filter maps by ${value} fps difficulty`;

    case "map-type":
      return value === "all"
        ? "Display all types of maps"
        : `Filter maps by ${value} type`;

    case "map-rating":
      return value === "all"
        ? "Display all ratings"
        : `Filter maps by ${value} rating`;

    default:
      return `Filter maps by ${value}`;
  }
}
