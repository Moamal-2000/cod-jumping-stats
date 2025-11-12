"use client";

import { updateGlobalState } from "@/redux/slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./ExpandButton.module.scss";

const ExpandButton = () => {
  const { loading, error, mapsData } = useSelector((s) => s.maps);
  const { isMapsExpanded } = useSelector((s) => s.global);

  const dispatch = useDispatch();
  const isMapsUnavailable = loading || error || mapsData?.length === 0;

  function handleExpandBtn() {
    dispatch(
      updateGlobalState({ key: "isMapsExpanded", value: !isMapsExpanded })
    );
  }

  return (
    <button
      type="button"
      className={s.expandButton}
      onClick={handleExpandBtn}
      disabled={isMapsUnavailable}
    >
      {isMapsExpanded ? "Hide Maps" : "Show Maps"}
    </button>
  );
};

export default ExpandButton;
