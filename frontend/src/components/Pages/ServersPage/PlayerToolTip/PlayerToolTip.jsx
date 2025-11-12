"use client";

import { useSelector } from "react-redux";
import s from "./PlayerToolTip.module.scss";

const PlayerToolTip = () => {
  const hoveredPlayer = useSelector((s) => s.global.hoveredPlayer);

  return (
    <div
      className={`${s.customTooltip} ${hoveredPlayer ? s.visible : ""}`}
      role="tooltip"
      aria-hidden={!hoveredPlayer}
      data-tooltip
    >
      {hoveredPlayer}
    </div>
  );
};

export default PlayerToolTip;
