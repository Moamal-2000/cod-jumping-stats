"use client";
import { CHART_HEIGHT, CHART_PADDING } from "@/data/constants";
import { getColoredName } from "@/functions/components";
import { getGraphRunTimes } from "@/functions/utils";
import { useEffect, useRef, useState } from "react";
import s from "./Graph.module.scss";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import Points from "./Points/Points";
import XAxisLabels from "./XAxisLabels/XAxisLabels";
import YAxisLabels from "./YAxisLabels/YAxisLabels";

const SCALE_MULTIPLIER = 1.15; // Multiplicative step for zooming
const SCALE_MIN = 1; // Minimum zoom scale (no zoom)
const SCALE_MAX = 10.0; // Maximum zoom scale
const EDGE_AUTOPAN_THRESHOLD_MIN_PX = 100; // Minimum pixel distance from edge to trigger auto-pan
const EDGE_AUTOPAN_THRESHOLD_RATIO = 0.08; // Percent of chart width to use for auto-pan threshold
const EDGE_AUTOPAN_TRIGGER_SCALE = 0.5; // Reduce trigger area to 50% of the computed width
const AUTOPAN_SPEED_BASE_PX = 8; // Max pixels per frame for auto-pan
const ZOOM_SENSITIVITY = 0.01; // Smaller value results in slower mouse wheel zoom

const Graph = ({ data: runData, isLoading = false }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const CHART_WIDTH = containerWidth || 800; // Final width used for calculations

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
  const edgeAutopanThresholdPx =
    Math.max(
      EDGE_AUTOPAN_THRESHOLD_MIN_PX,
      EDGE_AUTOPAN_THRESHOLD_RATIO * CHART_WIDTH,
    ) * EDGE_AUTOPAN_TRIGGER_SCALE;
  const mapName = runData?.[0]?.MapName;

  function getGraphPoints() {
    if (!runData || runData.length === 0) return [];

    return runData
      .map((runEntry) => ({
        timestamp: new Date(runEntry.TimeCreated).getTime(), // X-coordinate is timestamp
        runTime: Number(runEntry.TimePlayed) || 0, // Y-coordinate is time played
        rawData: runEntry, // Original run object
      }))
      .sort(
        (leftPoint, rightPoint) => leftPoint.timestamp - rightPoint.timestamp,
      );
  }

  const graphPoints = getGraphPoints();
  const yAxisData = getGraphRunTimes(graphPoints);

  const handleMouseDown = (mouseEvent) => {
    if (zoomScale <= SCALE_MIN) return;
    isDraggingRef.current = true;
    dragStartXRef.current = mouseEvent.clientX;
    dragStartPanOffsetRef.current = panOffsetPx;
    document.body.style.cursor = "grabbing";
  };

  const handleTouchStart = (touchEvent) => {
    if (zoomScale <= SCALE_MIN) return;
    const touch = touchEvent.touches && touchEvent.touches[0];
    if (!touch) return;
    isDraggingRef.current = true;
    dragStartXRef.current = touch.clientX;
    dragStartPanOffsetRef.current = panOffsetPx;
    // Prevent the browser from scrolling
    touchEvent.preventDefault();
  };

  const calculateNewPanOffset = (currentPanOffset, dragDeltaX) => {
    // Focal point for scaling/panning (center of the chart)
    const focalPointX = CHART_WIDTH / 2;
    // Pan bounds calculation (based on center-of-chart panning logic)
    const minPan = (CHART_PADDING.left - focalPointX) * (zoomScale - 1);
    const maxPan =
      (CHART_WIDTH - CHART_PADDING.right - focalPointX) * (zoomScale - 1);

    const nextPan = currentPanOffset - dragDeltaX;
    // Clamp between minPan and maxPan
    return Math.max(minPan, Math.min(maxPan, nextPan));
  };

  const handleMouseMove = (mouseEvent) => {
    if (!isDraggingRef.current) return;
    const dragDeltaX = mouseEvent.clientX - dragStartXRef.current;
    const nextPan = calculateNewPanOffset(
      dragStartPanOffsetRef.current,
      dragDeltaX,
    );
    panRef.current = nextPan;
    setPanOffsetPx(nextPan);
  };

  const handleTouchMove = (touchEvent) => {
    if (!isDraggingRef.current) return;
    const touch = touchEvent.touches && touchEvent.touches[0];
    if (!touch) return;
    const dragDeltaX = touch.clientX - dragStartXRef.current;
    const nextPan = calculateNewPanOffset(
      dragStartPanOffsetRef.current,
      dragDeltaX,
    );
    panRef.current = nextPan;
    setPanOffsetPx(nextPan);
    touchEvent.preventDefault();
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

  const setScaleAround = (nextScale, localCursorX) => {
    const focalPointX = CHART_WIDTH / 2;
    const currentScale = scaleRef.current;
    const currentPan = panRef.current;

    // Default to focal point if no localCursorX provided (e.g., button click)
    const zoomPivotX =
      typeof localCursorX === "number" ? localCursorX : focalPointX;

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

  const increaseScale = (localCursorX) => {
    const nextScale = Math.min(SCALE_MAX, scaleRef.current * SCALE_MULTIPLIER);
    setScaleAround(nextScale, localCursorX);
  };

  const decreaseScale = (localCursorX) => {
    const nextScale = Math.max(SCALE_MIN, scaleRef.current / SCALE_MULTIPLIER);
    setScaleAround(nextScale, localCursorX);
  };

  const getPanBounds = (scaleLevel = zoomScale) => {
    const focalPointX = CHART_WIDTH / 2;
    // The min pan offset occurs when the far left of the data is aligned with the left padding boundary.
    const minPan = (CHART_PADDING.left - focalPointX) * (scaleLevel - 1);
    // The max pan offset occurs when the far right of the data is aligned with the right padding boundary.
    const maxPan =
      (CHART_WIDTH - CHART_PADDING.right - focalPointX) * (scaleLevel - 1);
    return { minPan, maxPan };
  };

  const autoPanStep = () => {
    const cursorX = mouseXLocalRef.current;
    if (cursorX == null || isDraggingRef.current) {
      rafAutoPanRef.current = null;
      return;
    }

    const { minPan, maxPan } = getPanBounds(scaleRef.current);
    const currentPan = panRef.current;
    let nextPan = currentPan;

    const leftEdgeLimit = edgeAutopanThresholdPx;
    const rightEdgeLimit = CHART_WIDTH - edgeAutopanThresholdPx;
    const isNearEdge = cursorX < leftEdgeLimit || cursorX > rightEdgeLimit;

    if (!isNearEdge) {
      rafAutoPanRef.current = null;
      return;
    }

    if (cursorX < leftEdgeLimit) {
      // Pan left
      const speedFactor = (leftEdgeLimit - cursorX) / leftEdgeLimit; // 0..1
      nextPan = Math.max(
        minPan,
        currentPan - Math.ceil(AUTOPAN_SPEED_BASE_PX * speedFactor),
      );
    } else if (cursorX > rightEdgeLimit) {
      // Pan right
      const speedFactor = (cursorX - rightEdgeLimit) / edgeAutopanThresholdPx; // >0
      nextPan = Math.min(
        maxPan,
        currentPan + Math.ceil(AUTOPAN_SPEED_BASE_PX * speedFactor),
      );
    }

    if (nextPan !== currentPan) {
      panRef.current = nextPan;
      setPanOffsetPx(nextPan);
    }

    rafAutoPanRef.current = requestAnimationFrame(autoPanStep);
  };

  const handleSvgPointerMove = (pointerClientX) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    const localCursorX = pointerClientX - svgRect.left;
    mouseXLocalRef.current = localCursorX;

    const leftEdgeLimit = edgeAutopanThresholdPx;
    const rightEdgeLimit = CHART_WIDTH - edgeAutopanThresholdPx;

    const isNearEdge =
      localCursorX < leftEdgeLimit || localCursorX > rightEdgeLimit;

    // Start auto pan loop if near edges and not already running
    if (isNearEdge && !rafAutoPanRef.current) {
      rafAutoPanRef.current = requestAnimationFrame(autoPanStep);
    }
    // Stop when moved away
    if (!isNearEdge && rafAutoPanRef.current) {
      cancelAnimationFrame(rafAutoPanRef.current);
      rafAutoPanRef.current = null;
    }
  };

  const handleSvgMouseMove = (mouseEvent) =>
    handleSvgPointerMove(mouseEvent.clientX);

  const handleSvgTouchMove = (touchEvent) => {
    const touch = touchEvent.touches && touchEvent.touches[0];
    if (touch) handleSvgPointerMove(touch.clientX);
  };

  const handleSvgMouseLeave = () => {
    mouseXLocalRef.current = null;
    if (rafAutoPanRef.current) {
      cancelAnimationFrame(rafAutoPanRef.current);
      rafAutoPanRef.current = null;
    }
  };

  const handleSvgKeyDown = (keyboardEvent) => {
    if (keyboardEvent.key === "ArrowLeft") {
      setPanOffsetPx((prevPan) =>
        Math.max(getPanBounds().minPan, prevPan - 40),
      );
      keyboardEvent.preventDefault();
    } else if (keyboardEvent.key === "ArrowRight") {
      setPanOffsetPx((prevPan) =>
        Math.min(getPanBounds().maxPan, prevPan + 40),
      );
      keyboardEvent.preventDefault();
    } else if (keyboardEvent.key === "+" || keyboardEvent.key === "=") {
      increaseScale();
      keyboardEvent.preventDefault();
    } else if (keyboardEvent.key === "-") {
      decreaseScale();
      keyboardEvent.preventDefault();
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
    const targetElement = containerRef.current;
    if (!targetElement || typeof ResizeObserver === "undefined") return;
    const resizeObserver = new ResizeObserver((resizeEntries) => {
      for (const resizeEntry of resizeEntries) {
        const nextContainerWidth = Math.floor(
          resizeEntry.contentRect.width || 800,
        );
        setContainerWidth(nextContainerWidth);
      }
    });
    resizeObserver.observe(targetElement);
    return () => resizeObserver.disconnect();
  }, []);

  // Add a native, non-passive wheel listener for zooming towards the cursor.
  useEffect(() => {
    const wheelTargetElement = svgRef.current || containerRef.current;
    if (!wheelTargetElement) return;
    const wheelHandler = (wheelEvent) => {
      // Prevent browser/OS pinch-zoom or page zoom
      wheelEvent.preventDefault();
      const svgRect = svgRef.current?.getBoundingClientRect();
      const localCursorX = svgRect
        ? wheelEvent.clientX - svgRect.left
        : CHART_WIDTH / 2;
      const zoomFactor = Math.exp(-wheelEvent.deltaY * ZOOM_SENSITIVITY);
      const nextScale = Math.max(
        SCALE_MIN,
        Math.min(SCALE_MAX, scaleRef.current * zoomFactor),
      );
      setScaleAround(nextScale, localCursorX);
    };
    wheelTargetElement.addEventListener("wheel", wheelHandler, {
      passive: false,
    });
    return () => wheelTargetElement.removeEventListener("wheel", wheelHandler);
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

  const allTimestamps = graphPoints.map((point) => point.timestamp);
  const allRunTimes = graphPoints.map((point) => point.runTime);
  const minTimestamp = Math.min(...allTimestamps);
  const maxTimestamp = Math.max(...allTimestamps);
  const minRunTime = 0;
  const maxRunTime = Math.max(...allRunTimes) || 1;

  // Time-to-Pixel X Scale function
  const scaleTimestampToX = (timestamp) => {
    if (maxTimestamp === minTimestamp) return CHART_PADDING.left;
    // 1. Calculate base (unscaled) X position
    const graphRange = maxTimestamp - minTimestamp;
    const pixelRange = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
    const baseUnscaledX =
      CHART_PADDING.left +
      ((timestamp - minTimestamp) / graphRange) * pixelRange;

    // 2. Apply scale and pan offset (centered on focalPointX)
    const focalPointX = CHART_WIDTH / 2;
    return (
      (baseUnscaledX - focalPointX) * zoomScale + focalPointX - panOffsetPx
    );
  };

  // Value-to-Pixel Y Scale function
  function scaleRunTimeToY(runTime) {
    const graphHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
    const dataRange = maxRunTime - minRunTime;
    // Y-axis is inverted (0 at top), so we subtract from 1
    const normalizedY =
      dataRange === 0 ? 0 : (runTime - minRunTime) / dataRange;
    return CHART_PADDING.top + (1 - normalizedY) * graphHeight;
  }

  const linePathD = graphPoints
    .map((graphPoint, pointIndex) => {
      const pointX = scaleTimestampToX(graphPoint.timestamp);
      const pointY = scaleRunTimeToY(graphPoint.runTime);
      return `${pointIndex === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
    })
    .join(" ");

  const areaPathD = `${linePathD} L ${scaleTimestampToX(
    graphPoints.at(-1).timestamp,
  ).toFixed(2)} ${CHART_HEIGHT - CHART_PADDING.bottom} L ${scaleTimestampToX(
    graphPoints[0].timestamp,
  ).toFixed(2)} ${CHART_HEIGHT - CHART_PADDING.bottom} Z`;

  // Format tooltip content
  const renderTooltip = () => {
    if (!hoveredPoint) return null;

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

  return (
    <div
      className={s.graphContainer}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleSvgKeyDown}
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
        onMouseMove={handleSvgMouseMove}
        onMouseLeave={handleSvgMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={(touchEvent) => {
          handleTouchMove(touchEvent); // Handle pan
          handleSvgTouchMove(touchEvent); // Handle auto-pan trigger
        }}
        onTouchEnd={handleDragEnd}
        viewBox={`0 0 ${Math.max(300, CHART_WIDTH)} ${CHART_HEIGHT}`}
        width="100%"
        height={CHART_HEIGHT}
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

        <Points
          graphPoints={graphPoints}
          scaleTimestampToX={scaleTimestampToX}
          scaleRunTimeToY={scaleRunTimeToY}
          setHoveredPoint={setHoveredPoint}
        />

        <XAxisLabels
          allTimestamps={allTimestamps}
          scaleTimestampToX={scaleTimestampToX}
        />

        <YAxisLabels
          graphPoints={graphPoints}
          scaleRunTimeToY={scaleRunTimeToY}
        />
      </svg>
    </div>
  );
};

export default Graph;
