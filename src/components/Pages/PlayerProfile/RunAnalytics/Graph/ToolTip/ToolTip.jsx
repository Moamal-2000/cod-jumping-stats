import { getColoredName } from "@/functions/components";
import s from "./ToolTip.module.scss";

const ToolTip = ({ hoveredPoint, mapName }) => {
  const { tooltipX, tooltipY } = hoveredPoint;
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

  return (
    <div
      className={s.tooltip}
      style={{ left: tooltipX + 10, top: tooltipY - 10 }}
    >
      <div className={s.header}>
        <strong>{coloredPlayerName || "Unknown Player"}</strong> /
        <strong>{mapName}</strong>
      </div>

      <div>Time: {hoveredRunData.TimePlayedString}</div>
      <div className={s.tooltipDate}>{formattedDate}</div>
    </div>
  );
};

export default ToolTip;
