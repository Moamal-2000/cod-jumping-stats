import { CHART_PADDING } from "@/data/graphConstants";
import { formatTimeBySeconds, toSecondsFlexible } from "@/lib/dateTime";
import s from "./YAxisLabels.module.scss";

const YAxisLabels = ({ graphPoints, scaleRunTimeToY }) => {
  const yAxisData = getGraphRunTimes(graphPoints);

  return yAxisData.map(({ seconds, formattedTime }, axisIndex) => (
    <text
      key={axisIndex}
      x={CHART_PADDING.left - 16}
      y={scaleRunTimeToY(seconds)}
      textAnchor="end"
      className={s.label}
    >
      {formattedTime}
    </text>
  ));
};

export default YAxisLabels;

function getGraphRunTimes(graphPoints = []) {
  const maxRunSeconds = graphPoints[0]?.rawData?.TimePlayed || 0;
  const averageRun = formatTimeBySeconds(maxRunSeconds / 2);

  const allTimePlayed = graphPoints.map(
    (point) => point?.rawData?.TimePlayedString,
  );

  const biggestTime =
    allTimePlayed.toSorted(
      (a, b) => toSecondsFlexible(b) - toSecondsFlexible(a),
    )[0] || "";

  const biggestTimeSeconds = toSecondsFlexible(biggestTime);
  const maxRunString = graphPoints[0]?.rawData?.TimePlayedString || "0";
  const formattedMaxRunString = maxRunString.replace(/\.\d+/g, "");

  return [
    {
      seconds: 7,
      formattedTime: "0:00",
    },
    {
      seconds: biggestTimeSeconds / 2,
      formattedTime: averageRun,
    },
    {
      seconds: biggestTimeSeconds - 5,
      formattedTime: formattedMaxRunString,
    },
  ];
}
