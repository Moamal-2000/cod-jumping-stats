"use client";

import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./ExpandButton.module.scss";

const ExpandButton = () => {
  const { loading, error, mapsData } = useSelector((s) => s.maps);
  const { isMapsExpanded } = useSelector((s) => s.global);

  const dispatch = useDispatch();
  const isMapsUnavailable = loading || error || mapsData?.length === 0;

  function handleExpandBtn() {
    dispatch(
      updateGlobalState({ key: "isMapsExpanded", value: !isMapsExpanded }),
    );
  }

  return (
    <button
      type="button"
      className={`${s.expandButton} ${isMapsExpanded ? s.active : ""}`}
      onClick={handleExpandBtn}
      disabled={isMapsUnavailable}
    >
      <svg aria-hidden="true">
        <use
          href={`/icons-sprite.svg#${isMapsExpanded ? "eye" : "eye-slash"}`}
        />
      </svg>
    </button>
  );
};

export default ExpandButton;
