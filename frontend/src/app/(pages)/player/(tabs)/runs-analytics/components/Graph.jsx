"use client";
import { stripColorCodes } from "@/Functions/utils";
import { useEffect, useRef, useState } from "react";
import styles from "../RunAnalytics.module.scss";

function formatDateLabel(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${(dt.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
}

const Graph = ({ data }) => {
  const [hover, setHover] = useState(null);
  // horizontal spacing scale between points. 1 = default, >1 increases spacing
  const [scale, setScale] = useState(1);
  const SCALE_STEP = 1.15; // multiplicative step
  const SCALE_MIN = 1;
  const SCALE_MAX = 10.0;
  const [pan, setPan] = useState(0); // pan offset in pixels
  const svgRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPan = useRef(0);

  function getGraphPoints() {
    if (!data || data.length === 0) return [];

    return data
      .map((run) => ({
        x: new Date(run.TimeCreated).getTime(),
        y: Number(run.TimePlayed) || 0,
        raw: run,
      }))
      .sort((a, b) => a.x - b.x);
  }

  const points = getGraphPoints();

  const width = 800;
  const height = 382;
  const padding = { l: 40, r: 12, t: 12, b: 28 };

  // dragging handlers for pan (defined before any early returns so hooks/order stays stable)
  const handleMouseDown = (e) => {
    if (scale <= SCALE_MIN) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartPan.current = pan;
    document.body.style.cursor = "grabbing";
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    // compute pan bounds for current scale
    const focal = width / 2;
    const minPan = (padding.l - focal) * (scale - 1);
    const maxPan = (width - padding.r - focal) * (scale - 1);
    let next = dragStartPan.current - delta;
    // clamp between minPan and maxPan
    next = Math.max(minPan, Math.min(maxPan, next));
    setPan(next);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = "";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scale, pan]);

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
    const base =
      padding.l +
      ((t - minX) / (maxX - minX)) * (width - padding.l - padding.r);
    const focal = width / 2;
    return (base - focal) * scale + focal - pan;
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

  const increaseScale = () =>
    setScale((s) => {
      const next = Math.min(SCALE_MAX, s * SCALE_STEP);
      // clamp pan to new bounds
      const focal = width / 2;
      const minPan = (padding.l - focal) * (next - 1);
      const maxPan = (width - padding.r - focal) * (next - 1);
      setPan((p) => Math.max(minPan, Math.min(maxPan, p)));
      return next;
    });
  const decreaseScale = () =>
    setScale((s) => {
      const next = Math.max(SCALE_MIN, s / SCALE_STEP);
      const focal = width / 2;
      const minPan = (padding.l - focal) * (next - 1);
      const maxPan = (width - padding.r - focal) * (next - 1);
      setPan((p) => Math.max(minPan, Math.min(maxPan, p)));
      return next;
    });

  return (
    <div className={styles.graphWrap} style={{ userSelect: "none" }}>
      <div className={styles.graphControls}>
        <button
          aria-label="zoom out"
          onClick={decreaseScale}
          className={styles.graphBtn}
        >
          -
        </button>
        <button
          aria-label="zoom in"
          onClick={increaseScale}
          className={styles.graphBtn}
        >
          +
        </button>
      </div>
      <svg
        ref={svgRef}
        onMouseDown={handleMouseDown}
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

        {/* x axis labels: show years from min run year to max run year */}
        {(() => {
          const minYear = new Date(minX).getFullYear();
          const maxYear = new Date(maxX).getFullYear();
          const years = [];
          for (let y = minYear; y <= maxYear; y++) years.push(y);
          return years.map((yr) => {
            const t = new Date(yr, 0, 1).getTime();
            const x = xScale(t);
            return (
              <text
                key={yr}
                x={x}
                y={height - 6}
                fontSize={11}
                fill="#9ca3af"
                textAnchor="middle"
              >
                {yr}
              </text>
            );
          });
        })()}

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
              {stripColorCodes(hover.p.raw.PlayerName)}
            </text>
            <text x={hover.x + 16} y={hover.y - 6} fontSize={11} fill="#9ca3af">
              {formatDateLabel(hover.p.raw.TimeCreated)} —{" "}
              {hover.p.raw.TimePlayedString || hover.p.raw.TimePlayed + "s"}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default Graph;
