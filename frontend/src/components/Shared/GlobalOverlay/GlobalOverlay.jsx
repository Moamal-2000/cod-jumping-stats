"use client";

import { toggleMobileNav } from "@/redux/slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./GlobalOverlay.module.scss";

const GlobalOverlay = () => {
  const { isGlobalOverlayActive } = useSelector((s) => s.global);
  const dispatch = useDispatch();
  const activeClass = isGlobalOverlayActive ? s.active : "";

  function handleOverlayClick() {
    if (!isGlobalOverlayActive) return;

    // Overlay also will be closed
    dispatch(toggleMobileNav({ value: false }));
  }

  return (
    <div
      className={`${s.overlay} ${activeClass}`}
      onClick={handleOverlayClick}
    />
  );
};

export default GlobalOverlay;
