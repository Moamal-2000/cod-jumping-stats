import Link from "next/link";
import s from "./NotFoundPageList.module.scss";

const NotFoundPageList = () => {
  return (
    <ul className={s.list}>
      <li>Double-check the URL for any typos.</li>
      <li>Use the navigation menu to find what you need.</li>
      <li>
        Return to the{" "}
        <Link href="/" className={s.link}>
          homepage
        </Link>{" "}
        and start fresh.
      </li>
    </ul>
  );
};

export default NotFoundPageList;
