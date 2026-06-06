import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import { NAV_LINKS_DATA } from "@/data/staticData";
import { toggleMobileNav } from "@/redux/features/global/slice/globalSlice";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import s from "./MobileNavLinks.module.scss";

const MobileNavLinks = () => {
  const isMobileNavActive = useSelector((s) => s.global.isMobileNavActive);

  const currentPage = usePathname();
  const dispatch = useDispatch();

  const activeClass = isMobileNavActive ? s.active : "";

  return (
    <ul className={`${s.links} ${activeClass}`}>
      {NAV_LINKS_DATA.map(({ name, href, iconName, id }) => {
        const isCurrentPage = currentPage === href;

        function handleLinkClick() {
          if (isCurrentPage) {
            return;
          }
          dispatch(toggleMobileNav({ value: false }));
        }

        return (
          <li key={id}>
            <TransitionLink
              href={href}
              className={isCurrentPage ? s.active : ""}
              onClick={handleLinkClick}
            >
              <svg aria-hidden="true">
                <use href={`/icons-sprite.svg#${iconName}`} />
              </svg>
              <span>{name}</span>
            </TransitionLink>
          </li>
        );
      })}
    </ul>
  );
};

export default MobileNavLinks;
