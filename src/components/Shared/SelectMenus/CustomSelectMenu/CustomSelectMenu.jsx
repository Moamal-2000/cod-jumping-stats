"use client";

import { SORT_MAPS_OPTIONS } from "@/data/staticData";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import s from "./CustomSelectMenu.module.scss";
import DropDownMenu from "./DropDownMenu/DropDownMenu";

const CustomSelectMenu = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("sort-by");
  const [currentSortBy, setCurrentSortBy] = useState(getSortByLabel(urlQuery));

  const visibleClass = isOpen ? `${s.visible}` : "";

  function handleClick() {
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      const isMenuClicked = menuRef.current?.contains(event.target);
      if (!isMenuClicked) setIsOpen(false);
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={s.selectWrapper}>
      <div ref={menuRef} className={`${s.selectMenu} ${visibleClass}`}>
        <button
          type="button"
          className={s.selectButton}
          onClick={handleClick}
          id={id}
        >
          <span>{currentSortBy}</span>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#solidArrow" />
          </svg>
        </button>
      </div>

      <DropDownMenu
        isOpen={isOpen}
        currentSortBy={currentSortBy}
        setCurrentSortBy={setCurrentSortBy}
        visibleClass={visibleClass}
      />
    </div>
  );
};

export default CustomSelectMenu;

function getSortByLabel(value) {
  if (!value) return "Newest First";

  for (const group of SORT_MAPS_OPTIONS) {
    const option = group.groupOptions.find((opt) => opt.value === value);
    if (option) return option.label;
  }

  return "Newest First";
}
