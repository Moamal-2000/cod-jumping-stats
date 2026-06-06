import TransitionLink from "../Links/TransitionLink/TransitionLink";
import s from "./Breadcrumbs.module.scss";

const Breadcrumbs = ({ labels, paths }) => {
  const previousPages = labels.slice(0, labels.length - 1);
  const currentPage = labels.at(-1);

  return (
    <nav className={s.breadcrumbs} data-type="breadcrumbs">
      {previousPages.map((page, index) => (
        <div className={s.page} key={index}>
          <TransitionLink href={paths?.[index]?.path}>{page}</TransitionLink>
          <span>/</span>
        </div>
      ))}

      <span className={s.currentPage}>{currentPage || "Unknown"}</span>
    </nav>
  );
};
export default Breadcrumbs;
