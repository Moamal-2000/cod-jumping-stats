import Link from "next/link";
import s from "./Breadcrumbs.module.scss";

const Breadcrumbs = ({ breadcrumbLabels, breadcrumbPaths }) => {
  const previousPages = breadcrumbLabels.slice(0, breadcrumbLabels.length - 1);
  const currentPage = breadcrumbLabels.at(-1);

  return (
    <div className={s.breadcrumbs} data-type="breadcrumbs">
      {previousPages.map((page, index) => (
        <div className={s.page} key={index}>
          <Link href={breadcrumbPaths?.[index]?.path}>{page}</Link>
          <span>/</span>
        </div>
      ))}

      <span className={s.currentPage}>{currentPage || "Unknown"}</span>
    </div>
  );
};
export default Breadcrumbs;
