"use client";

import SvgIcon from "../../SvgIcon";
import s from "./CopyButton.module.scss";

const CopyButton = ({ copyText, title }) => {
  return (
    <button
      className={s.copyButton}
      title={title}
      type="button"
      onClick={() => navigator.clipboard.writeText(copyText)}
    >
      <SvgIcon name="copy" />
    </button>
  );
};

export default CopyButton;
