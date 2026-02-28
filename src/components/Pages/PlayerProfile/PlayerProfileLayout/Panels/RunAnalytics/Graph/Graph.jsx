"use client";

import {
  AUTOPAN_SPEED_BASE_PX,
  CHART_HEIGHT,
  CHART_PADDING,
  EDGE_AUTOPAN_THRESHOLD_MIN_PX,
  EDGE_AUTOPAN_THRESHOLD_RATIO,
  EDGE_AUTOPAN_TRIGGER_SCALE,
  MOBILE_BREAKPOINT_PX,
  SCALE_MAX,
  SCALE_MIN,
  SCALE_MULTIPLIER,
  ZOOM_SENSITIVITY,
} from "@/data/graphConstants";
import { useEffect, useRef, useState } from "react";
import EmptyGraphState from "./EmptyGraphState/EmptyGraphState";
import s from "./Graph.module.scss";
import LoadingUI from "./LoadingUI/LoadingUI";
import Points from "./Points/Points";
import ToolTip from "./ToolTip/ToolTip";
import XAxisLabels from "./XAxisLabels/XAxisLabels";
import YAxisLabels from "./YAxisLabels/YAxisLabels";

const Graph = ({ data: runData, isLoading = false }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const CHART_WIDTH = containerWidth || 800; // Final width used for calculations
  const isMobileChart = CHART_WIDTH <= MOBILE_BREAKPOINT_PX;
  const chartPadding = isMobileChart
    ? { ...CHART_PADDING, left: 12, right: 12 }
    : CHART_PADDING;

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
    const minPan = (chartPadding.left - focalPointX) * (zoomScale - 1);
    const maxPan =
      (CHART_WIDTH - chartPadding.right - focalPointX) * (zoomScale - 1);

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
    const minPan = (chartPadding.left - focalPointX) * (scaleLevel - 1);
    // The max pan offset occurs when the far right of the data is aligned with the right padding boundary.
    const maxPan =
      (CHART_WIDTH - chartPadding.right - focalPointX) * (scaleLevel - 1);
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

  const handleSvgWheel = (wheelEvent) => {
    // Keep zoom interaction scoped to the graph surface itself.
    wheelEvent.preventDefault();
    wheelEvent.stopPropagation();

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

  // Use native non-passive wheel listener to reliably prevent browser/page zoom.
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    svgElement.addEventListener("wheel", handleSvgWheel, { passive: false });
    return () => svgElement.removeEventListener("wheel", handleSvgWheel);
  });

  // Resize observer to make chart responsive
  useEffect(() => {
    const targetElement = containerRef.current;
    if (!targetElement || typeof ResizeObserver === "undefined") return;

    // Sync immediately so first painted SVG uses actual container width.
    const immediateWidth = Math.floor(
      targetElement.getBoundingClientRect().width,
    );
    if (immediateWidth > 0) {
      setContainerWidth(immediateWidth);
    }

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
  }, [isLoading, graphPoints.length]);

  if (isLoading) return <LoadingUI />;
  if (graphPoints.length === 0) return <EmptyGraphState />;

  const allTimestamps = graphPoints.map((point) => point.timestamp);
  const allRunTimes = graphPoints.map((point) => point.runTime);
  const minTimestamp = Math.min(...allTimestamps);
  const maxTimestamp = Math.max(...allTimestamps);
  const minRunTime = 0;
  const maxRunTime = Math.max(...allRunTimes) || 1;

  // Time-to-Pixel X Scale function
  const scaleTimestampToX = (timestamp) => {
    if (maxTimestamp === minTimestamp) return chartPadding.left;
    // 1. Calculate base (unscaled) X position
    const graphRange = maxTimestamp - minTimestamp;
    const pixelRange = CHART_WIDTH - chartPadding.left - chartPadding.right;
    const baseUnscaledX =
      chartPadding.left +
      ((timestamp - minTimestamp) / graphRange) * pixelRange;

    // 2. Apply scale and pan offset (centered on focalPointX)
    const focalPointX = CHART_WIDTH / 2;
    return (
      (baseUnscaledX - focalPointX) * zoomScale + focalPointX - panOffsetPx
    );
  };

  // Value-to-Pixel Y Scale function
  function scaleRunTimeToY(runTime) {
    const graphHeight = CHART_HEIGHT - chartPadding.top - chartPadding.bottom;
    const dataRange = maxRunTime - minRunTime;
    // Y-axis is inverted (0 at top), so we subtract from 1
    const normalizedY =
      dataRange === 0 ? 0 : (runTime - minRunTime) / dataRange;
    return chartPadding.top + (1 - normalizedY) * graphHeight;
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
  ).toFixed(2)} ${CHART_HEIGHT - chartPadding.bottom} L ${scaleTimestampToX(
    graphPoints[0].timestamp,
  ).toFixed(2)} ${CHART_HEIGHT - chartPadding.bottom} Z`;

  return (
    <div className={s.graphContainer} ref={containerRef}>
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

      {hoveredPoint && (
        <ToolTip
          hoveredPoint={hoveredPoint}
          mapName={mapName}
          chartWidth={CHART_WIDTH}
          chartHeight={CHART_HEIGHT}
        />
      )}

      <svg
        ref={svgRef}
        tabIndex={0}
        onKeyDown={handleSvgKeyDown}
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
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* area */}
        <path d={areaPathD} fill="url(#areaGrad)" stroke="#none" />
        {/* line */}
        <path d={linePathD} fill="none" stroke="#60a5fa" strokeWidth={2.5} />

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

        {!isMobileChart && (
          <YAxisLabels
            graphPoints={graphPoints}
            scaleRunTimeToY={scaleRunTimeToY}
          />
        )}
      </svg>
    </div>
  );
};

export default Graph;
