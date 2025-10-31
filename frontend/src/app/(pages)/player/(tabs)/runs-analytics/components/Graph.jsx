"use client";
import { useMemo, useState } from "react";
import styles from "../RunAnalytics.module.scss";

function formatDateLabel(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${(dt.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
}

const Graph = ({ data }) => {
  const [hover, setHover] = useState(null);

  const points = useMemo(() => {
    if (!data || data.length === 0) return [];
    // map to {x: timestamp, y: time_played}
    return data
      .map((r) => ({
        x: new Date(r.time_created).getTime(),
        y: Number(r.time_played) || 0,
        raw: r,
      }))
      .sort((a, b) => a.x - b.x);
  }, [data]);

  const width = 800;
  const height = 300;
  const padding = { l: 40, r: 12, t: 12, b: 28 };

  if (points.length === 0) {
    return (
      <div className={styles.graphWrap}>
        <div className={styles.graphTitle}>No data to display</div>
      </div>
    );
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0;
  const maxY = Math.max(...ys) || 1;

  const xScale = (t) => {
    if (maxX === minX) return padding.l;
    return (
      padding.l + ((t - minX) / (maxX - minX)) * (width - padding.l - padding.r)
    );
  };
  const yScale = (v) => {
    const h = height - padding.t - padding.b;
    return padding.t + (1 - (v - minY) / (maxY - minY)) * h;
  };

  const pathD = points
    .map((p, i) => {
      const x = xScale(p.x);
      const y = yScale(p.y);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const areaD = `${pathD} L ${xScale(points[points.length - 1].x).toFixed(2)} ${
    height - padding.b
  } L ${xScale(points[0].x).toFixed(2)} ${height - padding.b} Z`;

  return (
    <div className={styles.graphWrap}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label="Runs timeline"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* area */}
        <path d={areaD} fill="url(#areaGrad)" stroke="none" />

        {/* line */}
        <path
          d={pathD}
          fill="none"
          stroke="#60a5fa"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* points */}
        {points.map((p, i) => {
          const x = xScale(p.x);
          const y = yScale(p.y);
          return (
            <g
              key={i}
              onMouseEnter={() => setHover({ p, x, y })}
              onMouseLeave={() => setHover(null)}
            >
              <circle
                cx={x}
                cy={y}
                r={4}
                fill="#1e40af"
                stroke="#a5b4fc"
                strokeWidth={1}
              />
            </g>
          );
        })}

        {/* x axis labels */}
        {points.map((p, i) => {
          const x = xScale(p.x);
          if (i % Math.max(1, Math.floor(points.length / 6)) !== 0) return null;
          return (
            <text
              key={i}
              x={x}
              y={height - 6}
              fontSize={10}
              fill="#9ca3af"
              textAnchor="middle"
            >
              {formatDateLabel(p.raw.time_created)}
            </text>
          );
        })}

        {/* y axis labels */}
        {[0, Math.round(maxY / 2), Math.round(maxY)].map((v, idx) => (
          <text key={idx} x={8} y={yScale(v)} fontSize={10} fill="#9ca3af">
            {v}
          </text>
        ))}

        {/* hover tooltip */}
        {hover && (
          <g>
            <rect
              x={hover.x + 8}
              y={hover.y - 36}
              width={180}
              height={48}
              rx={8}
              fill="rgba(2,6,23,0.9)"
              stroke="rgba(255,255,255,0.04)"
            />
            <text
              x={hover.x + 16}
              y={hover.y - 18}
              fontSize={12}
              fill="#f9fafb"
            >
              {hover.p.raw.playername}
            </text>
            <text x={hover.x + 16} y={hover.y - 6} fontSize={11} fill="#9ca3af">
              {formatDateLabel(hover.p.raw.time_created)} —{" "}
              {hover.p.raw.time_played_string || hover.p.raw.time_played + "s"}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default Graph;
