"use client";

import { isMobile } from "@/lib/validation";
import { toggleMobileNav } from "@/redux/features/global/slice/globalSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./MobileNavBtn.module.scss";

const MobileNavBtn = () => {
  const { isMobileNavActive } = useSelector((s) => s.global);
  const dispatch = useDispatch();
  const iconName = isMobileNavActive ? "x-mark" : "hamburger";
  const title = `${isMobileNavActive ? "Close" : "Open"} navigation menu`;
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const moveClass = isMobileNavActive ? s.move : "";
  const mobileClass = isMobileDevice ? s.mobile : "";

  function handleToggleMenu() {
    dispatch(toggleMobileNav());
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMobileDevice(isMobile());
    }, 0);

    return () => clearTimeout(timeoutId);
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
