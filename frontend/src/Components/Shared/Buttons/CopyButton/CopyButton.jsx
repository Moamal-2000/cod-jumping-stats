"use client";

import { useState } from "react";
import SvgIcon from "../../SvgIcon";
import s from "./CopyButton.module.scss";

const CopyButton = ({ copyText, title }) => {
  const [isCopied, setIsCopied] = useState(false);

  async function handleClick() {
    if (isCopied) return

    try {
      navigator.clipboard.writeText(copyText);
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Can't copy text:", err);
      setIsCopied(false);
    }
  }

  return (
    <button
      className={s.copyButton}
      title={title}
      type="button"
      onClick={handleClick}
    >
      <SvgIcon name={isCopied ? "checked" : "copy"} />
    </button>
  );
};

export default CopyButton;
