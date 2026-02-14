import { CHART_PADDING } from "@/data/graphConstants";
import { getGraphRunTimes } from "@/functions/utils";
import s from "./YAxisLabels.module.scss";

const YAxisLabels = ({ graphPoints, scaleRunTimeToY }) => {
  const yAxisData = getGraphRunTimes(graphPoints);

  return yAxisData.map(({ seconds, formattedTime }, axisIndex) => (
    <text
      key={axisIndex}
      x={CHART_PADDING.left - 16}
      y={scaleRunTimeToY(seconds)}
      textAnchor="end"
      className={s.yAxisLabel}
    >
      {formattedTime}
    </text>
  ));
};

export default YAxisLabels;
