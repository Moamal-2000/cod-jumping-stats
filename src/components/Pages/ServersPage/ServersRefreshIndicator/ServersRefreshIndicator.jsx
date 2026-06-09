"use client";

import useServersRefresh from "@/hooks/app/useServersRefresh";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./ServersRefreshIndicator.module.scss";
import StatusIcon from "./StatusIcon/StatusIcon";

const ServersRefreshIndicator = ({ onRefresh, refreshSeconds }) => {
  const { didServersFetchOk, didServersFetchFail } = useSelector(
    (s) => s.global,
  );
  const dispatch = useDispatch();

  const handleRefreshStart = useCallback(() => {
    dispatch(updateGlobalState({ key: "didServersFetchOk", value: false }));
    dispatch(updateGlobalState({ key: "didServersFetchFail", value: false }));
  }, [dispatch]);

  const { isVisible, refreshStage } = useServersRefresh(
    refreshSeconds,
    onRefresh,
    didServersFetchOk,
    didServersFetchFail,
    handleRefreshStart,
  );

  const isError = refreshStage === "error";
  const isChecked = refreshStage === "after";
  const textClasses = `${s.text} ${isChecked ? s.checked : ""} ${isError ? s.error : ""}`;

  return (
    <div className={`${s.indicator} ${isVisible ? s.visible : s.hidden}`}>
      <StatusIcon refreshStage={refreshStage} isError={isError} />
      <p className={textClasses}>Refreshing servers...</p>
    </div>
  );
};

export default ServersRefreshIndicator;
