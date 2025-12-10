import Link from "next/link";
import s from "./EmptyState.module.scss";

/**
 * Empty state component for when no favorites exist.
 * Displays a friendly message with a call-to-action link.
 *
 * @param {Object} props
 * @param {string} props.type - Either 'maps' or 'players'
 */
const EmptyState = ({ type }) => {
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
      description:
        "Discover players and add your favorites to track them here.",
      linkText: "Browse Players",
      linkHref: "/players",
    },
  };

  const { icon, title, description, linkText, linkHref } = config[type];

  return (
    <div className={s.emptyState}>
      <div className={s.iconWrapper}>
        <svg className={s.icon} aria-hidden="true">
          <use href={`/icons-sprite.svg#${icon}`} />
        </svg>
      </div>

      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>

      <Link href={linkHref} className={s.ctaButton}>
        <svg className={s.ctaIcon} aria-hidden="true">
          <use href={`/icons-sprite.svg#${icon}`} />
        </svg>
        {linkText}
      </Link>
    </div>
  );
};

export default EmptyState;
