"use client";

import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import { NAV_LINKS_DATA } from "@/data/staticData";
import { usePathname } from "next/navigation";
import s from "./MainNav.module.scss";

const MainNav = () => {
  const currentPage = usePathname();

  return (
    <nav className={s.mainNav}>
      {NAV_LINKS_DATA.map(({ name, href, iconName, id }) => (
        <TransitionLink
          key={id}
          href={href}
          className={currentPage === href ? s.active : ""}
        >
          <svg aria-hidden="true">
            <use href={`/icons-sprite.svg#${iconName}`} />
          </svg>
          <span>{name}</span>
        </TransitionLink>
      ))}
    </nav>
  );
};

export default MainNav;
