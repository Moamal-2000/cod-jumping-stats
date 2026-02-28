"use client";

import { createQueryString, removeQueryString } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import s from "./CustomLabeledCheckbox.module.scss";

const CustomLabeledCheckbox = ({ name, labelText, queryName }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const hasTrueValue = searchParams.get(queryName) === "true";
  const [isChecked, setIsChecked] = useState(hasTrueValue);

  function updateCheckboxState() {
    setIsChecked((prevValue) => !prevValue);

    if (isChecked) {
      removeQueryString(queryName, searchParams, router, pathname);
      return;
    }

    createQueryString(queryName, !isChecked, searchParams, router, pathname);
  }

  function handleKeyDown(event) {
    const isEnterKey = event.code === "Enter" || event.keyCode === 13;
    if (isEnterKey) updateCheckboxState();
  }

  return (
    <div className={s.labeledCheckbox}>
      <label htmlFor={name}>{labelText}</label>

      <div className={s.customCheckbox} />

      <input
        type="checkbox"
        name={name}
        id={name}
        checked={isChecked}
        aria-checked={isChecked}
        onChange={updateCheckboxState}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default CustomLabeledCheckbox;
