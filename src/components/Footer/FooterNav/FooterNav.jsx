"use client";

import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import { NAV_LINKS_DATA } from "@/data/staticData";
import { usePathname } from "next/navigation";
import s from "./FooterNav.module.scss";

const FooterNav = () => {
  const currentPage = usePathname();

  return (
    <nav className={s.navigation}>
      <h2 role="presentation">Navigation</h2>

      <ul className={s.links}>
        {NAV_LINKS_DATA.map(({ name, href, iconName, id }) => (
          <li key={id}>
            <TransitionLink
              href={href}
              className={currentPage === href ? s.active : ""}
            >
              <svg aria-hidden="true">
                <use href={`/icons-sprite.svg#${iconName}`} />
              </svg>
              <span>{name}</span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterNav;
