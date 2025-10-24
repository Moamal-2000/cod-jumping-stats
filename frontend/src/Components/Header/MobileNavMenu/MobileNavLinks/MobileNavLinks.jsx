import { NAV_LINKS_DATA } from "@/Data/staticData";
import { toggleMobileNav } from "@/Redux/slices/globalSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import s from "./MobileNavLinks.module.scss";

const MobileNavLinks = () => {
  const { isMobileNavActive } = useSelector((s) => s.global);
  const activeClass = isMobileNavActive ? s.active : "";
  const currentPage = usePathname();
  const dispatch = useDispatch();

  return (
    <ul className={`${s.links} ${activeClass}`}>
      {NAV_LINKS_DATA.map(({ name, href, iconName, id }) => {
        const isCurrentPage = currentPage === href;
        const activeClass = isCurrentPage ? s.active : "";

        function handleLinkClick() {
          if (isCurrentPage) return;
          dispatch(toggleMobileNav({ value: false }));
        }

        return (
          <li key={id}>
            <Link
              href={href}
              className={`${s.link} ${activeClass}`}
              onClick={handleLinkClick}
            >
              <svg aria-hidden="true">
                <use href={`/icons-sprite.svg#${iconName}`} />
              </svg>
              <span>{name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default MobileNavLinks;
