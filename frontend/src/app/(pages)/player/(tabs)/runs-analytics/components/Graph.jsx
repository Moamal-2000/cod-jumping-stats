"use client";
import { stripColorCodes } from "@/Functions/utils";
import { useEffect, useRef, useState } from "react";
import styles from "../RunAnalytics.module.scss";

const SCALE_STEP = 1.15; // multiplicative step
const SCALE_MIN = 1;
const SCALE_MAX = 10.0;
const EDGE_THRESHOLD_MIN = 100; // px minimum edge threshold
const EDGE_THRESHOLD_RATIO = 0.08; // percent of width to use for threshold
const SPEED_BASE = 8; // pixels per frame maximum for auto-pan
const ZOOM_SENSITIVITY = 0.0018; // smaller = slower

function formatDateLabel(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${(dt.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
}

const Graph = ({ data }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const width = containerWidth || 800;
  const height = 382;
  const padding = { l: 40, r: 12, t: 12, b: 28 };

  const [hover, setHover] = useState(null);
  // horizontal spacing scale between points. 1 = default, >1 increases spacing
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState(0); // pan offset in pixels
  const svgRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPan = useRef(0);
  const mouseXRef = useRef(null);
  const rafAutoRef = useRef(null);

  const edgeThresholdPx = Math.max(
    EDGE_THRESHOLD_MIN,
    EDGE_THRESHOLD_RATIO * width
  ); // pixels from edge to trigger auto-pan

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

  // dragging handlers for pan (defined before any early returns so hooks/order stays stable)
  const handleMouseDown = (e) => {
    if (scale <= SCALE_MIN) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartPan.current = pan;
    document.body.style.cursor = "grabbing";
  };
  const handleTouchStart = (e) => {
    if (scale <= SCALE_MIN) return;
    const t = e.touches && e.touches[0];
    if (!t) return;
    isDragging.current = true;
    dragStartX.current = t.clientX;
    dragStartPan.current = pan;
    // prevent the browser from scrolling while interacting with the chart
    e.preventDefault();
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
  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const t = e.touches && e.touches[0];
    if (!t) return;
    const delta = t.clientX - dragStartX.current;
    const focal = width / 2;
    const minPan = (padding.l - focal) * (scale - 1);
    const maxPan = (width - padding.r - focal) * (scale - 1);
    let next = dragStartPan.current - delta;
    next = Math.max(minPan, Math.min(maxPan, next));
    setPan(next);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = "";
  };
  // refs for latest values (used by native event handlers)
  const scaleRef = useRef(scale);
  const panRef = useRef(pan);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  // set scale around a pixel coordinate (localX within svg/container)
  const setScaleAround = (nextScale, localX) => {
    const focal = width / 2;
    const s = scaleRef.current;
    const p = panRef.current;
    const x = typeof localX === "number" ? localX : focal;
    // compute base (pre-scale) from current values
    const base = (x + p - focal) / s + focal;
    // compute new pan so that base maps to same x after scaling
    const panNext = (base - focal) * nextScale + focal - x;
    // clamp
    const minPan = (padding.l - focal) * (nextScale - 1);
    const maxPan = (width - padding.r - focal) * (nextScale - 1);
    const panClamped = Math.max(minPan, Math.min(maxPan, panNext));
    // apply (update refs immediately so rapid wheel events compute from latest values)
    scaleRef.current = nextScale;
    panRef.current = panClamped;
    setScale(nextScale);
    setPan(panClamped);
  };

  const increaseScale = (localX) => {
    const next = Math.min(SCALE_MAX, scaleRef.current * SCALE_STEP);
    setScaleAround(next, localX);
  };
  const decreaseScale = (localX) => {
    const next = Math.max(SCALE_MIN, scaleRef.current / SCALE_STEP);
    setScaleAround(next, localX);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scale, pan]);

  // resize observer to make chart responsive
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width || 800);
        setContainerWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // add a native, non-passive wheel listener to prevent browser/OS zoom and page scroll
  // and to zoom towards the cursor. Uses refs to read latest scale/pan.
  useEffect(() => {
    const el = svgRef.current || containerRef.current;
    if (!el) return;
    const wheelHandler = (ev) => {
      // prevent browser/OS pinch-zoom or page zoom that some touchpads trigger
      ev.preventDefault();
      const rect = svgRef.current?.getBoundingClientRect();
      const localX = rect ? ev.clientX - rect.left : width / 2;
      const factor = Math.exp(-ev.deltaY * ZOOM_SENSITIVITY);
      const next = Math.max(
        SCALE_MIN,
        Math.min(SCALE_MAX, scaleRef.current * factor)
      );
      setScaleAround(next, localX);
    };
    el.addEventListener("wheel", wheelHandler, { passive: false });
    return () => el.removeEventListener("wheel", wheelHandler);
    // intentionally empty deps: handler reads current values from refs
  }, []);

  // compute pan bounds helper
  const getPanBounds = () => {
    const focal = width / 2;
    const minPan = (padding.l - focal) * (scale - 1);
    const maxPan = (width - padding.r - focal) * (scale - 1);
    return { minPan, maxPan };
  };

  // auto-pan when mouse near edges
  const autoPanStep = () => {
    const mx = mouseXRef.current;
    if (mx == null || isDragging.current) {
      rafAutoRef.current = requestAnimationFrame(autoPanStep);
      return;
    }
    const { minPan, maxPan } = getPanBounds();
    let next = pan;
    const leftEdge = edgeThresholdPx;
    const rightEdge = width - edgeThresholdPx;
    if (mx < leftEdge) {
      const factor = (leftEdge - mx) / leftEdge; // 0..1
      next = Math.max(minPan, pan - Math.ceil(SPEED_BASE * factor));
    } else if (mx > rightEdge) {
      const factor = (mx - rightEdge) / edgeThresholdPx;
      next = Math.min(maxPan, pan + Math.ceil(SPEED_BASE * factor));
    }
    if (next !== pan) setPan(next);
    rafAutoRef.current = requestAnimationFrame(autoPanStep);
  };

  const onSvgMouseMove = (e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = e.clientX - rect.left;
    mouseXRef.current = localX;
    // start auto pan loop if near edges and not already running
    if (
      (localX < edgeThresholdPx || localX > width - edgeThresholdPx) &&
      !rafAutoRef.current
    ) {
      rafAutoRef.current = requestAnimationFrame(autoPanStep);
    }
    // stop when moved away
    if (
      localX >= edgeThresholdPx &&
      localX <= width - edgeThresholdPx &&
      rafAutoRef.current
    ) {
      cancelAnimationFrame(rafAutoRef.current);
      rafAutoRef.current = null;
    }
  };

  const onSvgTouchMove = (e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    const t = e.touches && e.touches[0];
    if (!rect || !t) return;
    const localX = t.clientX - rect.left;
    mouseXRef.current = localX;
    if (
      (localX < edgeThresholdPx || localX > width - edgeThresholdPx) &&
      !rafAutoRef.current
    ) {
      rafAutoRef.current = requestAnimationFrame(autoPanStep);
    }
    if (
      localX >= edgeThresholdPx &&
      localX <= width - edgeThresholdPx &&
      rafAutoRef.current
    ) {
      cancelAnimationFrame(rafAutoRef.current);
      rafAutoRef.current = null;
    }
  };

  const onSvgMouseLeave = () => {
    mouseXRef.current = null;
    if (rafAutoRef.current) {
      cancelAnimationFrame(rafAutoRef.current);
      rafAutoRef.current = null;
    }
  };

  const onSvgKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setPan((p) => Math.max(getPanBounds().minPan, p - 40));
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      setPan((p) => Math.min(getPanBounds().maxPan, p + 40));
      e.preventDefault();
    } else if (e.key === "+" || e.key === "=") {
      increaseScale();
      e.preventDefault();
    } else if (e.key === "-") {
      decreaseScale();
      e.preventDefault();
    }
  };

  if (points.length === 0) {
    return (
      <div className={styles.graphWrap} ref={containerRef}>
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

  return (
    <div
      className={styles.graphWrap}
      style={{ userSelect: "none", touchAction: "none" }}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onSvgKeyDown}
    >
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
        onMouseMove={onSvgMouseMove}
        onMouseLeave={onSvgMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => {
          handleTouchMove(e);
          onSvgTouchMove(e);
        }}
        onTouchEnd={() => handleMouseUp()}
        viewBox={`0 0 ${Math.max(300, width)} ${height}`}
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
