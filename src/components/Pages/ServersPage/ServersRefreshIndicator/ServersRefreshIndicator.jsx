"use client";

import AnimatedSpinnerIcon from "@/components/Shared/Loaders/SpinnerLoader/AnimatedSpinnerIcon";
import useServersRefresh from "@/hooks/app/useServersRefresh";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./ServersRefreshIndicator.module.scss";

const ServersRefreshIndicator = ({ onRefresh, refreshSeconds }) => {
  const didServersFetchOk = useSelector((s) => s.global.didServersFetchOk);
  const dispatch = useDispatch();

  const handleRefreshStart = useCallback(() => {
    dispatch(updateGlobalState({ key: "didServersFetchOk", value: false }));
  }, [dispatch]);

  const { isVisible, refreshStage } = useServersRefresh(
    refreshSeconds,
    onRefresh,
    didServersFetchOk,
    handleRefreshStart,
  );

  return (
    <div className={`${s.container} ${isVisible ? s.visible : s.hidden}`}>
      <div className={s.indicator}>
        <div className={s.spinnerWrapper}>
          {refreshStage === "before" ? (
            <AnimatedSpinnerIcon />
          ) : (
            <svg className={s.checkedIcon} aria-hidden="true">
              <use href="/icons-sprite.svg#checked" />
            </svg>
          )}
        </div>
        <div className={s.content}>
          <p
            className={`${s.text} ${refreshStage === "after" ? s.checked : ""}`}
          >
            Refreshing servers...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServersRefreshIndicator;
