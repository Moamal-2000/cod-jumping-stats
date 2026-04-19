"use client";

import { COPY_BUTTON_DELAY_MS } from "@/data/constants";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import s from "./CopyButton.module.scss";

const CopyButton = ({ textToCopy, title }) => {
  const [isCopied, setIsCopied] = useState(false);
  const dispatch = useDispatch();

  return (
    <button
      className={s.copyButton}
      title={title}
      type="button"
      onClick={() =>
        handleClick({ textToCopy, isCopied, setIsCopied, dispatch })
      }
    >
      <svg aria-hidden="true">
        <use href={`icons-sprite.svg#${isCopied ? "checked" : "copy"}`} />
      </svg>
    </button>
  );
};

export default CopyButton;

async function handleClick({
  textToCopy,
  isCopied,
  setIsCopied,
  dispatch,
} = {}) {
  if (isCopied) {
    return;
  }

  try {
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    dispatch(updateGlobalState({ key: "activeCopyAlert", value: true }));

    setTimeout(() => setIsCopied(false), COPY_BUTTON_DELAY_MS);
  } catch (err) {
    console.error("Can't copy text:", err);
    setIsCopied(false);
  }
}
