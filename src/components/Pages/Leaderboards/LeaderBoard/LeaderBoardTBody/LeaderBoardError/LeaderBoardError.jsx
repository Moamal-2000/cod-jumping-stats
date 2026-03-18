"use client";

import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./LeaderBoardError.module.scss";

const LeaderBoardError = () => {
  const tryFetchAgain = useSelector((s) => s.global.tryFetchAgain);
  const dispatch = useDispatch();

  function handleRetryButton() {
    const payload = { key: "tryFetchAgain", value: tryFetchAgain + 1 };
    dispatch(updateGlobalState(payload));
  }

  return (
    <tr className={s.error} data-error>
      <td>
        <div className={s.errorIcon} />

        <b className={s.title}>Rankings Not Loading</b>
        <p className={s.description}>
          We're having trouble fetching the latest player rankings. Check your
          internet connection and tap retry.
        </p>

        <button
          type="button"
          className={s.retryBtn}
          onClick={handleRetryButton}
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#retry" />
          </svg>
          <span>Retry</span>
        </button>
      </td>
    </tr>
  );
};

export default LeaderBoardError;
