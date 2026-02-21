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
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#solid-star" />
      </svg>

      <div className={s.tooltip} role="tooltip">
        Star us on GitHub
        <div className={s.borderEffect} />
        <div className={s.effectHover} />
      </div>
    </a>
  );
};

export default GitHubStarBtn;

export const gitHubRepoUrl = SOCIAL_MEDIA_DATA.find(
  ({ iconName }) => iconName === "github",
).link;
