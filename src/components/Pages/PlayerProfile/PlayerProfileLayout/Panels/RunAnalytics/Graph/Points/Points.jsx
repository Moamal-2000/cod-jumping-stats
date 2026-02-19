import s from "./Points.module.scss";

const Points = ({
  graphPoints,
  scaleTimestampToX,
  scaleRunTimeToY,
  setHoveredPoint,
}) => {
  function handleMouseEnter(graphPoint, pointX, pointY) {
    setHoveredPoint({
      point: graphPoint,
      tooltipX: pointX,
      tooltipY: pointY,
    });
  }

  return graphPoints.map((graphPoint) => {
    const pointX = scaleTimestampToX(graphPoint.timestamp);
    const pointY = scaleRunTimeToY(graphPoint.runTime);

    return (
      <g
        key={graphPoint.timestamp}
        onMouseEnter={() => handleMouseEnter(graphPoint, pointX, pointY)}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <circle className={s.point} cx={pointX} cy={pointY} r={4} />
      </g>
    );
  });
};

export default Points;
