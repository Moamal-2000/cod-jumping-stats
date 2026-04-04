"use client";

import CopyRights from "@/components/Footer/CopyRights/CopyRights";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import MobileNavLinks from "./MobileNavLinks/MobileNavLinks";
import s from "./MobileNavMenu.module.scss";

const MobileNavMenu = () => {
  const isMobileNavActive = useSelector((s) => s.global.isMobileNavActive);
  const activeClass = isMobileNavActive ? s.active : "";

  useEffect(() => {
    document.body.classList.toggle("noScroll", isMobileNavActive);
  }, [isMobileNavActive]);

  return (
    <nav className={`${s.mobileNav} ${activeClass}`} inert={!isMobileNavActive}>
      <p className={s.title}>Main Navigation</p>

      <MobileNavLinks />

      <div className={s.copyRights}>
        <CopyRights />
      </div>
    </nav>
  );
};

export default MobileNavMenu;
