"use client";

import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./ExpandButton.module.scss";

const ExpandButton = ({ controlsId }) => {
  const { loading, error, mapsData } = useSelector((s) => s.maps);
  const isMapsExpanded = useSelector((s) => s.global.isMapsExpanded);

  const dispatch = useDispatch();

  const isMapsUnavailable = loading || error || mapsData?.length === 0;
  const title = isMapsExpanded ? "Hide all maps" : "Show all maps";

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
      aria-label={title}
      aria-expanded={isMapsExpanded}
      aria-controls={controlsId}
      title={title}
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
