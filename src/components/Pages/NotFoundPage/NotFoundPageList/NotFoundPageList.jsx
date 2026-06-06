import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import s from "./NotFoundPageList.module.scss";

const NotFoundPageList = () => {
  return (
    <ul className={s.list}>
      <li>Double-check the URL for any typos.</li>
      <li>Use the navigation menu to find what you need.</li>
      <li>
        Return to the{" "}
        <TransitionLink href="/" className={s.link}>
          homepage
        </TransitionLink>{" "}
        and start fresh.
      </li>
    </ul>
  );
};

export default NotFoundPageList;
