"use client";

import { isMobile } from "@/functions/validation";
import { toggleMobileNav } from "@/redux/slices/globalSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./MobileNavBtn.module.scss";

const MobileNavBtn = () => {
  const { isMobileNavActive } = useSelector((s) => s.global);
  const dispatch = useDispatch();
  const iconName = isMobileNavActive ? "xMark" : "hamburger";
  const title = `${isMobileNavActive ? "Close" : "Open"} navigation menu`;
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const moveClass = isMobileNavActive ? s.move : "";
  const mobileClass = isMobileDevice ? s.mobile : "";

  function handleToggleMenu() {
    dispatch(toggleMobileNav());
  }

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  return (
    <button
      type="button"
      className={`${moveClass} ${s.mobileNavBtn} ${mobileClass}`}
      onClick={handleToggleMenu}
      title={title}
    >
      <svg aria-hidden="true">
        <use href={`/icons-sprite.svg#${iconName}`} />
      </svg>
    </button>
  );
};

export default MobileNavBtn;
