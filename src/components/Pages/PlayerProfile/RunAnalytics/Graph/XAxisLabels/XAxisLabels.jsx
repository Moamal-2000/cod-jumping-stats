import { CHART_HEIGHT } from "@/data/constants";
import s from "./XAxisLabels.module.scss";

const XAxisLabels = ({ allTimestamps, scaleTimestampToX }) => {
  const minTimestamp = Math.min(...allTimestamps);
  const maxTimestamp = Math.max(...allTimestamps);

  const minYear = new Date(minTimestamp).getFullYear();
  const maxYear = new Date(maxTimestamp).getFullYear();

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  );

  return years.map((year) => {
    const yearStartTimestamp = new Date(year, 0, 1).getTime();
    const labelX = scaleTimestampToX(yearStartTimestamp);

    return (
      <text
        key={year}
        x={labelX}
        y={CHART_HEIGHT - 6}
        textAnchor="middle"
        className={s.label}
      >
        {year}
      </text>
    );
  });
};

export default XAxisLabels;
