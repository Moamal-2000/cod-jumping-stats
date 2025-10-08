"use client";

import { getSortByLabel } from "@/Functions/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import s from "./CustomSelectMenu.module.scss";
import DropDownMenu from "./DropDownMenu/DropDownMenu";

const CustomSelectMenu = () => {
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
      const isSelectMenu = menuRef.current.contains(event.target);
      const elementRole = event.target?.closest("button")?.getAttribute("role");
      const isOption = elementRole === "option";
      const shouldCloseMenu = (menuRef.current && !isSelectMenu) || isOption;

      if (shouldCloseMenu) setIsOpen(false);
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className={`${s.selectMenu} ${visibleClass}`}>
      <button type="button" className={s.selectButton} onClick={handleClick}>
        <span>{currentSortBy}</span>
        <svg>
          <use href="/badgesIcons.svg#solidArrow" />
        </svg>
      </button>

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
