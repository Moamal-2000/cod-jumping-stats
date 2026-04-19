import { getColoredName } from "@/components/Helper/playerNameColor";
import { TOOLTIP_EDGE_PADDING_PX, TOOLTIP_GAP_PX } from "@/data/graphConstants";
import { useLayoutEffect, useRef, useState } from "react";
import s from "./ToolTip.module.scss";

const ToolTip = ({ hoveredPoint, mapName, chartWidth, chartHeight }) => {
  const { tooltipX, tooltipY } = hoveredPoint;

  const [position, setPosition] = useState({ left: tooltipX, top: tooltipY });
  const tooltipRef = useRef(null);

  const hoveredRunData = hoveredPoint.point.rawData;
  const coloredPlayerName = getColoredName(hoveredRunData.PlayerName);
  const date = new Date(hoveredRunData.TimeCreated);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  useLayoutEffect(() => {
    calcToolTipPosition({
      tooltipX,
      tooltipY,
      chartWidth,
      chartHeight,
      tooltipRef,
      setPosition,
    });
  }, [tooltipX, tooltipY, chartWidth, chartHeight]);

  return (
    <div ref={tooltipRef} className={s.tooltip} style={position} role="tooltip">
      <div className={s.header}>
        <strong>{coloredPlayerName || "Unknown Player"}</strong>
        <strong>{mapName}</strong>
      </div>

      <div className={s.time}>Time: {hoveredRunData.TimePlayedString}</div>
      <div className={s.date}>{formattedDate}</div>
    </div>
  );
};

export default ToolTip;

function calcToolTipPosition({
  tooltipX,
  tooltipY,
  chartWidth,
  chartHeight,
  tooltipRef,
  setPosition,
}) {
  const tooltipElement = tooltipRef.current;
  if (!tooltipElement) {
    return;
  }

  const { width: tooltipWidth, height: tooltipHeight } =
    tooltipElement.getBoundingClientRect();

  const safeWidth = chartWidth || 0;
  const safeHeight = chartHeight || 0;

  let nextLeft = tooltipX + TOOLTIP_GAP_PX;
  let nextTop = tooltipY - TOOLTIP_GAP_PX;

  const isNearRightEdge =
    nextLeft + tooltipWidth > safeWidth - TOOLTIP_EDGE_PADDING_PX;
  const isNearBottomEdge = nextTop - tooltipHeight < TOOLTIP_EDGE_PADDING_PX;

  if (isNearRightEdge) {
    nextLeft = tooltipX - tooltipWidth - TOOLTIP_GAP_PX;
  }
  if (isNearBottomEdge) {
    nextTop = tooltipY + TOOLTIP_GAP_PX;
  } else {
    nextTop -= tooltipHeight;
  }

  const minLeft = TOOLTIP_EDGE_PADDING_PX;
  const maxLeft = Math.max(minLeft, safeWidth - tooltipWidth - minLeft);

  const minTop = TOOLTIP_EDGE_PADDING_PX;
  const maxTop = Math.max(minTop, safeHeight - tooltipHeight - minTop);

  const left = Math.min(maxLeft, Math.max(minLeft, nextLeft));
  const top = Math.min(maxTop, Math.max(minTop, nextTop));

  setPosition({ left, top });
}
