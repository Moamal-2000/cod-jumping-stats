"use client";

import useTrackPageVisits from "@/hooks/app/useTrackPageVisits";
import s from "./LayoutLayer.module.scss";

const LayoutLayer = ({ children }) => {
  useTrackPageVisits();

  return <div className={s.websiteLayer}>{children}</div>;
};

export default LayoutLayer;
