"use client";

import { GITHUB_REPO_API_URL, GITHUB_REPO_URL } from "@/data/constants";
import { useEffect, useState } from "react";
import s from "./GitHubNotice.module.scss";

const GitHubNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stars, setStars] = useState(0);

  useEffect(() => {
    const isClosed = localStorage.getItem("github-notice-closed") === "true";
    if (isClosed) {
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), 10000);

    fetchProjectRepo().then((data) => setStars(data?.stargazers_count || 0));

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
          support its development, a{" "}
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
            ⭐ Star on GitHub
          </a>{" "}
          really helps. Join <span>⭐{stars}</span> others who have already
          supported the project.
        </p>

        <button
          className={s.closeBtn}
          onClick={handleClose}
          aria-label="Close notification"
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#x-mark" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GitHubNotice;

async function fetchProjectRepo() {
  try {
    const response = await fetch(GITHUB_REPO_API_URL);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(` Error fetching repo stars: ${error}`);
    return [];
  }
}
