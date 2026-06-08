import { useCallback, useEffect, useRef, useState } from "react";

const useServersRefresh = (
  refreshIntervalSeconds,
  refetch,
  didServersFetchOk,
  didServersFetchFail,
  onRefreshStart,
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [refreshStage, setRefreshStage] = useState("before");

  const refreshTimeoutRef = useRef(null);
  const cycleTimeoutRef = useRef(null);
  const pollingTimerRef = useRef(null);
  const waitingForOkRef = useRef(false);

  const startRefreshCycle = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    if (cycleTimeoutRef.current) {
      clearTimeout(cycleTimeoutRef.current);
    }

    setIsVisible(true);
    setRefreshStage("before");

    refreshTimeoutRef.current = setTimeout(() => {
      waitingForOkRef.current = true;
      onRefreshStart?.();

      if (refetch) {
        refetch();
      }
    }, 3000);
  }, [onRefreshStart, refetch]);

  useEffect(() => {
    if (!refreshIntervalSeconds || refreshIntervalSeconds === "disabled") {
      waitingForOkRef.current = false;
      setIsVisible(false);
      setRefreshStage("before");
      return;
    }

    const intervalMs = parseInt(refreshIntervalSeconds) * 1000;
    if (!intervalMs) {
      return;
    }

    pollingTimerRef.current = setInterval(startRefreshCycle, intervalMs);

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (cycleTimeoutRef.current) {
        clearTimeout(cycleTimeoutRef.current);
      }
    };
  }, [refreshIntervalSeconds, startRefreshCycle]);

  useEffect(() => {
    if (!didServersFetchOk || !waitingForOkRef.current) {
      return;
    }

    waitingForOkRef.current = false;
    setRefreshStage("after");

    cycleTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setRefreshStage("before");
    }, 3000);
  }, [didServersFetchOk]);

  useEffect(() => {
    if (!didServersFetchFail || !waitingForOkRef.current) {
      return;
    }

    waitingForOkRef.current = false;
    setRefreshStage("error");

    cycleTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setRefreshStage("before");
    }, 300000);
  }, [didServersFetchFail]);

  return { isVisible, refreshStage, startRefreshCycle };
};

export default useServersRefresh;
