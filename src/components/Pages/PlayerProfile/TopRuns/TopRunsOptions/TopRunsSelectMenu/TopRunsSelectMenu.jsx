"use client";

import { createQueryString, removeQueryString } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./TopRunsSelectMenu.module.scss";

const TopRunsSelectMenu = ({ options, label, urlQuery }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleOnChange(event) {
    const value = event.target.value;
    const defaultValue = options[0].value;

    if (value === defaultValue) {
      removeQueryString(urlQuery, searchParams, router, pathname);
      return;
    }

    createQueryString(urlQuery, value, searchParams, router, pathname);
  }

  return (
    <div className={s.selectWrapper}>
      {label && <label htmlFor={urlQuery}>{label}</label>}

      <select id={urlQuery} onChange={handleOnChange} className={s.select}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TopRunsSelectMenu;
