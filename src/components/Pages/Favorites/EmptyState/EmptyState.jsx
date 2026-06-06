import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import s from "./EmptyState.module.scss";

const EmptyState = ({ type }) => {
  const { icon, title, description, linkText, linkHref } = config[type];

  return (
    <div className={s.emptyState}>
      <div className={s.iconWrapper}>
        <svg aria-hidden="true">
          <use href={`/icons-sprite.svg#${icon}`} />
        </svg>
      </div>

      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>

      <TransitionLink href={linkHref} className={s.browseLink}>
        <svg aria-hidden="true">
          <use href={`/icons-sprite.svg#${icon}`} />
        </svg>
        {linkText}
      </TransitionLink>
    </div>
  );
};

export default EmptyState;

const config = {
  maps: {
    icon: "map",
    title: "No favorite maps yet",
    description:
      "Start exploring maps and add your favorites to see them here.",
    linkText: "Browse Maps",
    linkHref: "/maps",
  },
  players: {
    icon: "users",
    title: "No favorite players yet",
    description: "Discover players and add your favorites to track them here.",
    linkText: "Browse Players",
    linkHref: "/players",
  },
};
