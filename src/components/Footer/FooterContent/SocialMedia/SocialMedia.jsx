import { SOCIAL_MEDIA_DATA } from "@/data/staticData";
import s from "./SocialMedia.module.scss";

const SocialMedia = () => {
  return (
    <nav className={s.socialMediaNav}>
      <h2 className={s.title} role="presentation">
        Connect with us
      </h2>

      <ul>
        {SOCIAL_MEDIA_DATA.map(({ iconName, link, id }) => (
          <li className={s.media} key={id}>
            <a
              href={link}
              target="_blank"
              title={iconName}
              data-icon={iconName}
            >
              <svg aria-hidden="true">
                <use href={`/icons-sprite.svg#${iconName}`} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SocialMedia;
