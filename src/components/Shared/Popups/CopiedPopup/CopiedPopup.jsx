"use client";

import { COPIED_POPUP_DELAY_MS } from "@/data/constants";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./CopiedPopup.module.scss";

const CopiedPopup = () => {
  const activeCopyAlert = useSelector((s) => s.global.activeCopyAlert);

  const dispatch = useDispatch();
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!activeCopyAlert) {
      return;
    }
    clearTimeout(debounceRef?.current);

    debounceRef.current = setTimeout(() => {
      dispatch(updateGlobalState({ key: "activeCopyAlert", value: false }));
    }, COPIED_POPUP_DELAY_MS);

    return () => clearTimeout(debounceRef?.current);
  }, [activeCopyAlert]);

  return (
    <p
      className={`${s.copiedPopup} ${activeCopyAlert ? s.visible : ""}`}
      role="alert"
    >
      Copied to clipboard
    </p>
  );
};
export default CopiedPopup;
