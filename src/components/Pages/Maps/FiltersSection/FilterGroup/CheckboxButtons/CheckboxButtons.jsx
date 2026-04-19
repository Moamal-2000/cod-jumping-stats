"use client";

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

  function handleKeyDown(event, queryValue) {
    if (event.key === "Enter") {
      handleChange(queryValue);
    }
  }

  return (
    <div className={s.checkboxes}>
      {filtersData?.map(({ text, queryValue, id }) => {
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
              onKeyDown={(event) => handleKeyDown(event, queryValue)}
              checked={isActive}
            />
            <span className={s.checkboxMark} aria-hidden="true">
              <svg>
                <use href="/icons-sprite.svg#checked" />
              </svg>
            </span>
            <span className={s.checkboxText}>{text}</span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckboxButtons;
