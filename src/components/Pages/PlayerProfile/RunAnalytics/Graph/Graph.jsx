"use client";
import { getColoredName } from "@/functions/components";
import { useEffect, useRef, useState } from "react";
import s from "./Graph.module.scss";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";

const SCALE_MULTIPLIER = 1.15; // Multiplicative step for zooming
const SCALE_MIN = 1; // Minimum zoom scale (no zoom)
const SCALE_MAX = 10.0; // Maximum zoom scale
const EDGE_AUTOPAN_THRESHOLD_MIN_PX = 100; // Minimum pixel distance from edge to trigger auto-pan
const EDGE_AUTOPAN_THRESHOLD_RATIO = 0.08; // Percent of chart width to use for auto-pan threshold
const AUTOPAN_SPEED_BASE_PX = 8; // Max pixels per frame for auto-pan
const ZOOM_SENSITIVITY = 0.01; // Smaller value results in slower mouse wheel zoom

const Graph = ({ data: runData, isLoading = false }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const chartWidth = containerWidth || 800; // Final width used for calculations
  const chartHeight = 382;
  const chartPadding = { left: 40, right: 12, top: 12, bottom: 28 };

  const [hoveredPoint, setHoveredPoint] = useState(null);
  // Horizontal zoom level. 1 = default spacing, >1 increases spacing.
  const [zoomScale, setZoomScale] = useState(1);
  // Horizontal pan offset in pixels relative to the default (unscaled, unpanned) position.
  const [panOffsetPx, setPanOffsetPx] = useState(0);

  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0); // ClientX coordinate where dragging started
  const dragStartPanOffsetRef = useRef(0); // panOffsetPx value when dragging started
  const mouseXLocalRef = useRef(null); // Local X position within the SVG/container
  const rafAutoPanRef = useRef(null); // Animation frame ID for auto-pan loop

  // Pixels from edge to trigger auto-pan
  const edgeAutopanThresholdPx = Math.max(
    EDGE_AUTOPAN_THRESHOLD_MIN_PX,
    EDGE_AUTOPAN_THRESHOLD_RATIO * chartWidth,
  );
  const mapName = runData?.[0]?.MapName;

  function getGraphPoints() {
    if (!runData || runData.length === 0) return [];

    return runData
      .map((run) => ({
        x: new Date(run.TimeCreated).getTime(), // X-coordinate is timestamp
        y: Number(run.TimePlayed) || 0, // Y-coordinate is time played
        rawData: run, // Original run object
      }))
      .sort((a, b) => a.x - b.x);
  }

  const graphPoints = getGraphPoints();

  const handleMouseDown = (event) => {
    if (zoomScale <= SCALE_MIN) return;
    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartPanOffsetRef.current = panOffsetPx;
    document.body.style.cursor = "grabbing";
  };

  const handleTouchStart = (event) => {
    if (zoomScale <= SCALE_MIN) return;
    const touch = event.touches && event.touches[0];
    if (!touch) return;
    isDraggingRef.current = true;
    dragStartXRef.current = touch.clientX;
    dragStartPanOffsetRef.current = panOffsetPx;
    // Prevent the browser from scrolling
    event.preventDefault();
  };

  const calculateNewPanOffset = (currentPan, deltaX) => {
    // Focal point for scaling/panning (center of the chart)
    const focalPointX = chartWidth / 2;
    // Pan bounds calculation (based on center-of-chart panning logic)
    const minPan = (chartPadding.left - focalPointX) * (zoomScale - 1);
    const maxPan =
      (chartWidth - chartPadding.right - focalPointX) * (zoomScale - 1);

    let nextPan = currentPan - deltaX;
    // Clamp between minPan and maxPan
    return Math.max(minPan, Math.min(maxPan, nextPan));
  };

  const handleMouseMove = (event) => {
    if (!isDraggingRef.current) return;
    const deltaX = event.clientX - dragStartXRef.current;
    const nextPan = calculateNewPanOffset(
      dragStartPanOffsetRef.current,
      deltaX,
    );
    setPanOffsetPx(nextPan);
  };

  const handleTouchMove = (event) => {
    if (!isDraggingRef.current) return;
    const touch = event.touches && event.touches[0];
    if (!touch) return;
    const deltaX = touch.clientX - dragStartXRef.current;
    const nextPan = calculateNewPanOffset(
      dragStartPanOffsetRef.current,
      deltaX,
    );
    setPanOffsetPx(nextPan);
    event.preventDefault();
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    document.body.style.cursor = "";
  };

  // Refs for latest state values (used by native event handlers)
  const scaleRef = useRef(zoomScale);
  const panRef = useRef(panOffsetPx);
  useEffect(() => {
    scaleRef.current = zoomScale;
  }, [zoomScale]);
  useEffect(() => {
    panRef.current = panOffsetPx;
  }, [panOffsetPx]);

  const setScaleAround = (nextScale, localX) => {
    const focalPointX = chartWidth / 2;
    const currentScale = scaleRef.current;
    const currentPan = panRef.current;

    // Default to focal point if no localX provided (e.g., button click)
    const zoomPivotX = typeof localX === "number" ? localX : focalPointX;

    const baseUnscaledX =
      (zoomPivotX + currentPan - focalPointX) / currentScale + focalPointX;

    const nextPan =
      (baseUnscaledX - focalPointX) * nextScale + focalPointX - zoomPivotX;

    // Clamp the new pan offset
    const { minPan, maxPan } = getPanBounds(nextScale);
    const panClamped = Math.max(minPan, Math.min(maxPan, nextPan));

    // Apply (update refs immediately so rapid wheel events compute from latest values)
    scaleRef.current = nextScale;
    panRef.current = panClamped;
    setZoomScale(nextScale);
    setPanOffsetPx(panClamped);
  };

  const increaseScale = (localX) => {
    const nextScale = Math.min(SCALE_MAX, scaleRef.current * SCALE_MULTIPLIER);
    setScaleAround(nextScale, localX);
  };

  const decreaseScale = (localX) => {
    const nextScale = Math.max(SCALE_MIN, scaleRef.current / SCALE_MULTIPLIER);
    setScaleAround(nextScale, localX);
  };

  const getPanBounds = (scaleLevel = zoomScale) => {
    const focalPointX = chartWidth / 2;
    // The min pan offset occurs when the far left of the data is aligned with the left padding boundary.
    const minPan = (chartPadding.left - focalPointX) * (scaleLevel - 1);
    // The max pan offset occurs when the far right of the data is aligned with the right padding boundary.
    const maxPan =
      (chartWidth - chartPadding.right - focalPointX) * (scaleLevel - 1);
    return { minPan, maxPan };
  };

  const autoPanStep = () => {
    const mouseX = mouseXLocalRef.current;
    if (mouseX == null || isDraggingRef.current) {
      rafAutoPanRef.current = requestAnimationFrame(autoPanStep);
      return;
    }

    const { minPan, maxPan } = getPanBounds();
    let nextPan = panOffsetPx;

    const leftEdgeLimit = edgeAutopanThresholdPx;
    const rightEdgeLimit = chartWidth - edgeAutopanThresholdPx;

    if (mouseX < leftEdgeLimit) {
      // Pan left
      const factor = (leftEdgeLimit - mouseX) / leftEdgeLimit; // 0..1
      nextPan = Math.max(
        minPan,
        panOffsetPx - Math.ceil(AUTOPAN_SPEED_BASE_PX * factor),
      );
    } else if (mouseX > rightEdgeLimit) {
      // Pan right
      const factor = (mouseX - rightEdgeLimit) / edgeAutopanThresholdPx; // >0
      nextPan = Math.min(
        maxPan,
        panOffsetPx + Math.ceil(AUTOPAN_SPEED_BASE_PX * factor),
      );
    }

    if (nextPan !== panOffsetPx) setPanOffsetPx(nextPan);
    rafAutoPanRef.current = requestAnimationFrame(autoPanStep);
  };

  const onSvgMove = (clientX) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = clientX - rect.left;
    mouseXLocalRef.current = localX;

    const leftEdgeLimit = edgeAutopanThresholdPx;
    const rightEdgeLimit = chartWidth - edgeAutopanThresholdPx;

    const nearEdge = localX < leftEdgeLimit || localX > rightEdgeLimit;

    // Start auto pan loop if near edges and not already running
    if (nearEdge && !rafAutoPanRef.current) {
      rafAutoPanRef.current = requestAnimationFrame(autoPanStep);
    }
    // Stop when moved away
    if (!nearEdge && rafAutoPanRef.current) {
      cancelAnimationFrame(rafAutoPanRef.current);
      rafAutoPanRef.current = null;
    }
  };

  const onSvgMouseMove = (event) => onSvgMove(event.clientX);

  const onSvgTouchMove = (event) => {
    const touch = event.touches && event.touches[0];
    if (touch) onSvgMove(touch.clientX);
  };

  const onSvgMouseLeave = () => {
    mouseXLocalRef.current = null;
    if (rafAutoPanRef.current) {
      cancelAnimationFrame(rafAutoPanRef.current);
      rafAutoPanRef.current = null;
    }
  };

  const onSvgKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      setPanOffsetPx((prevPan) =>
        Math.max(getPanBounds().minPan, prevPan - 40),
      );
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      setPanOffsetPx((prevPan) =>
        Math.min(getPanBounds().maxPan, prevPan + 40),
      );
      event.preventDefault();
    } else if (event.key === "+" || event.key === "=") {
      increaseScale();
      event.preventDefault();
    } else if (event.key === "-") {
      decreaseScale();
      event.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleDragEnd);
    // Note: handleMouseUp was renamed to handleDragEnd for clarity
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [zoomScale, panOffsetPx]); // Depend on state to get latest pan bounds in handleMouseMove

  // Resize observer to make chart responsive
  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width || 800);
        setContainerWidth(width);
      }
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  // Add a native, non-passive wheel listener for zooming towards the cursor.
  useEffect(() => {
    const element = svgRef.current || containerRef.current;
    if (!element) return;
    const wheelHandler = (event) => {
      // Prevent browser/OS pinch-zoom or page zoom
      event.preventDefault();
      const rect = svgRef.current?.getBoundingClientRect();
      const localX = rect ? event.clientX - rect.left : chartWidth / 2;
      const factor = Math.exp(-event.deltaY * ZOOM_SENSITIVITY);
      const nextScale = Math.max(
        SCALE_MIN,
        Math.min(SCALE_MAX, scaleRef.current * factor),
      );
      setScaleAround(nextScale, localX);
    };
    element.addEventListener("wheel", wheelHandler, { passive: false });
    return () => element.removeEventListener("wheel", wheelHandler);
    // Intentionally empty deps: handler reads current values from refs
  }, []);

  if (isLoading) {
    return (
      <div className={s.graphContainer} ref={containerRef}>
        <div className={s.loadingState}>
          <LoadingSpinner />
          <p>Loading graph data...</p>
        </div>
      </div>
    );
  }

  if (graphPoints.length === 0) {
    return (
      <div className={s.graphContainer} ref={containerRef}>
        <div className={s.emptyState}>
          <svg>
            <use href="/icons-sprite.svg#message" />
          </svg>
          <p>No run data available for the selected map</p>
        </div>
      </div>
    );
  }

  const allXValues = graphPoints.map((point) => point.x);
  const allYValues = graphPoints.map((point) => point.y);
  const minXValue = Math.min(...allXValues);
  const maxXValue = Math.max(...allXValues);
  const minYValue = 0;
  const maxYValue = Math.max(...allYValues) || 1;

  // Time-to-Pixel X Scale function
  const xScale = (timestamp) => {
    if (maxXValue === minXValue) return chartPadding.left;
    // 1. Calculate base (unscaled) X position
    const graphRange = maxXValue - minXValue;
    const pixelRange = chartWidth - chartPadding.left - chartPadding.right;
    const baseUnscaledX =
      chartPadding.left + ((timestamp - minXValue) / graphRange) * pixelRange;

    // 2. Apply scale and pan offset (centered on focalPointX)
    const focalPointX = chartWidth / 2;
    return (
      (baseUnscaledX - focalPointX) * zoomScale + focalPointX - panOffsetPx
    );
  };

  // Value-to-Pixel Y Scale function
  const yScale = (value) => {
    const graphHeight = chartHeight - chartPadding.top - chartPadding.bottom;
    const dataRange = maxYValue - minYValue;
    // Y-axis is inverted (0 at top), so we subtract from 1
    const normalizedY = dataRange === 0 ? 0 : (value - minYValue) / dataRange;
    return chartPadding.top + (1 - normalizedY) * graphHeight;
  };

  const linePathD = graphPoints
    .map((point, index) => {
      const x = xScale(point.x);
      const y = yScale(point.y);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const areaPathD = `${linePathD} L ${xScale(graphPoints.at(-1).x).toFixed(
    2,
  )} ${chartHeight - chartPadding.bottom} L ${xScale(graphPoints[0].x).toFixed(
    2,
  )} ${chartHeight - chartPadding.bottom} Z`;

  // Format tooltip content
  const renderTooltip = () => {
    if (!hoveredPoint) return null;

    const { x, y } = hoveredPoint;
    const pointData = hoveredPoint.point.rawData;
    const coloredPlayerName = getColoredName(pointData.PlayerName);

    const date = new Date(pointData.TimeCreated);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className={s.tooltip} style={{ left: x + 10, top: y - 10 }}>
        <div className={s.header}>
          <strong>{coloredPlayerName || "Unknown Player"}</strong> /
          <strong>{mapName}</strong>
        </div>

        <div>Time: {pointData.TimePlayedString}</div>
        <div className={s.tooltipDate}>{formattedDate}</div>
      </div>
    );
  };

  return (
    <div
      className={s.graphContainer}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onSvgKeyDown}
      style={{ userSelect: "none", touchAction: "none" }}
    >
      <div className={s.graphControls}>
        <button
          aria-label="Zoom out"
          onClick={() => decreaseScale()}
          className={s.controlButton}
          disabled={zoomScale <= SCALE_MIN}
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#zoom-out" />
          </svg>
        </button>
        <button
          aria-label="Reset zoom"
          onClick={() => {
            setZoomScale(1);
            setPanOffsetPx(0);
          }}
          className={s.controlButton}
          disabled={zoomScale === 1 && panOffsetPx === 0}
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#infinite-circles" />
          </svg>
        </button>
        <button
          aria-label="Zoom in"
          onClick={() => increaseScale()}
          className={s.controlButton}
          disabled={zoomScale >= SCALE_MAX}
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#zoom-in" />
          </svg>
        </button>
      </div>

      {hoveredPoint && renderTooltip()}
      <svg
        ref={svgRef}
        onMouseDown={handleMouseDown}
        onMouseMove={onSvgMouseMove}
        onMouseLeave={onSvgMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={(event) => {
          handleTouchMove(event); // Handle pan
          onSvgTouchMove(event); // Handle auto-pan trigger
        }}
        onTouchEnd={handleDragEnd}
        viewBox={`0 0 ${Math.max(300, chartWidth)} ${chartHeight}`}
        width="100%"
        height={chartHeight}
        role="img"
        aria-label="Runs timeline graph"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* area */}
        <path d={areaPathD} fill="url(#areaGrad)" stroke="none" />

        {/* line */}
        <path
          d={linePathD}
          fill="none"
          stroke="#60a5fa"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* points */}
        {graphPoints.map((point, index) => {
          const x = xScale(point.x);
          const y = yScale(point.y);
          return (
            <g
              key={index}
              onMouseEnter={() => setHoveredPoint({ point, x, y })}
              onMouseLeave={() => setHoveredPoint(null)}
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
          const minYear = new Date(minXValue).getFullYear();
          const maxYear = new Date(maxXValue).getFullYear();
          const years = [];
          for (let year = minYear; year <= maxYear; year++) years.push(year);
          return years.map((year) => {
            const timestamp = new Date(year, 0, 1).getTime();
            const x = xScale(timestamp);
            return (
              <text
                key={year}
                x={x}
                y={chartHeight - 6}
                fontSize={11}
                fill="#9ca3af"
                textAnchor="middle"
              >
                {year}
              </text>
            );
          });
        })()}

        {/* y axis labels */}
        {[0, Math.round(maxYValue / 2), Math.round(maxYValue)].map(
          (value, index) => (
            <text
              key={index}
              x={8}
              y={yScale(value)}
              fontSize={10}
              fill="#9ca3af"
            >
              {value}
            </text>
          ),
        )}
      </svg>
    </div>
  );
};

export default Graph;
