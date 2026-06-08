"use client";

import AnimatedSpinnerIcon from "@/components/Shared/Loaders/SpinnerLoader/AnimatedSpinnerIcon";
import useServersRefresh from "@/hooks/app/useServersRefresh";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./ServersRefreshIndicator.module.scss";

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

  return (
    <div className={`${s.container} ${isVisible ? s.visible : s.hidden}`}>
      <div className={s.indicator}>
        <div className={s.spinnerWrapper}>
          {refreshStage === "before" ? (
            <AnimatedSpinnerIcon />
          ) : (
            <svg
              className={isError ? s.errorIcon : s.checkedIcon}
              aria-hidden="true"
            >
              <use
                href={`/icons-sprite.svg#${isError ? "x-mark" : "checked"}`}
              />
            </svg>
          )}
        </div>
        <div className={s.content}>
          <p
            className={`${s.text} ${isChecked ? s.checked : ""} ${isError ? s.error : ""}`}
          >
            Refreshing servers...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServersRefreshIndicator;
