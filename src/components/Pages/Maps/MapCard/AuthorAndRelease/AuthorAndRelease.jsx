import { formateReleaseDate } from "@/lib/utils";
import s from "./AuthorAndRelease.module.scss";

const AuthorAndRelease = ({ author, release }) => {
  return (
    <div className={s.authorAndRelease}>
      <div className={s.authorWrapper}>
        <span className={s.authorName}>Map by: {author}</span>
      </div>

      <div className={s.releaseBox}>
        <div className={s.title}>Released</div>
        <p className={s.date}>{formateReleaseDate(release)}</p>
      </div>
    </div>
  );
};

export default AuthorAndRelease;
