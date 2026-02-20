"use client";

import { SOCIAL_MEDIA_DATA } from "@/data/staticData";
import s from "./GitHubStarBtn.module.scss";

const GitHubStarBtn = () => {
  return (
    <a
      href={gitHubRepoUrl}
      className={s.githubStarBtn}
      aria-label="Star us on GitHub"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <div className={s.tooltip}>
        Star us on GitHub
        <div className={s.borderEffect} />
        <div className={s.effectHover} />
      </div>
    </a>
  );
};

export default GitHubStarBtn;

const gitHubRepoUrl = SOCIAL_MEDIA_DATA.find(
  ({ iconName }) => iconName === "github",
).link;
