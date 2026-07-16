import Link from "next/link";
import { useSearchParams } from "next/navigation";
import s from "./Breadcrumbs.module.scss";

const Breadcrumbs = ({ labels, paths }) => {
  const previousPages = labels.slice(0, labels.length - 1);
  const currentPage = labels.at(-1);

  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("source") || "jh";

  return (
    <nav className={s.breadcrumbs} data-type="breadcrumbs">
      {previousPages.map((page, index) => {
        const path = paths?.[index]?.path;
        const href = `${path}${sourceParam === "jh" || path === "/" ? "" : `?source=${sourceParam}`}`;

        return (
          <div className={s.page} key={index}>
            <Link href={href}>{page}</Link>
            <span>/</span>
          </div>
        );
      })}

      <span className={s.currentPage}>{currentPage || "Unknown"}</span>
    </nav>
  );
};
export default Breadcrumbs;
