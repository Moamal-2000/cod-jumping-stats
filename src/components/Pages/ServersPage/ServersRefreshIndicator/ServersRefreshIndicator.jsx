"use client";

import useServersRefresh from "@/hooks/app/useServersRefresh";
import { resetServersFetchStatus } from "@/redux/features/servers/slice/serversSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./ServersRefreshIndicator.module.scss";
import StatusIcon from "./StatusIcon/StatusIcon";

const ServersRefreshIndicator = ({ onRefresh, refreshSeconds }) => {
  const { didServersFetchOk, didServersFetchFail } = useSelector(
    (s) => s.servers,
  );

  const dispatch = useDispatch();

  function handleRefreshStart() {
    dispatch(resetServersFetchStatus());
  }

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
