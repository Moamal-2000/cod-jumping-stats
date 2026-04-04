"use client";

import useTrackPageVisits from "@/hooks/app/useTrackPageVisits";
import { useSelector } from "react-redux";
import s from "./LayoutLayer.module.scss";

const LayoutLayer = ({ children }) => {
  const isMobileNavActive = useSelector((s) => s.global.isMobileNavActive);

  useTrackPageVisits();

  return (
    <div className={s.websiteLayer} inert={isMobileNavActive}>
      {children}
    </div>
  );
};

export default LayoutLayer;
