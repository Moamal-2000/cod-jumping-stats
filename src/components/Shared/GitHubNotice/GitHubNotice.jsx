"use client";

import { GITHUB_REPO_URL } from "@/data/constants";
import { useEffect, useState } from "react";
import s from "./GitHubNotice.module.scss";

const GitHubNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isClosed = localStorage.getItem("github-notice-closed") === "true";
    if (isClosed) return;

    const timer = setTimeout(() => setIsVisible(true), 10000);

    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    localStorage.setItem("github-notice-closed", "true");
    setIsVisible(false);
  }

  return (
    <div className={`${s.notice} ${isVisible ? s.visible : ""}`}>
      <div className={s.content}>
        <p>
          This project is built for the JumpersHeaven community. If you want to
          support its development, a ⭐ on{" "}
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          really helps.
        </p>

        <button
          className={s.closeBtn}
          onClick={handleClose}
          aria-label="Close notification"
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#xMark" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GitHubNotice;
