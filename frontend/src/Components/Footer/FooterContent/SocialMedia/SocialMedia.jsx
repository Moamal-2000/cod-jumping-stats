import { SOCIAL_MEDIA_DATA } from "@/Data/staticData";
import s from "./SocialMedia.module.scss";

const SocialMedia = () => {
  return (
    <nav className={s.socialMediaNav}>
      <h4 className={s.title}>Connect with us</h4>

      <ul>
        {SOCIAL_MEDIA_DATA.map(({ iconName, link, id }) => (
          <li className={s.media} key={id}>
            <a
              href={link}
              target="_blank"
              title={iconName}
              data-icon={iconName}
            >
              <svg>
                <use href={`/badgesIcons.svg#${iconName}`} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SocialMedia;
