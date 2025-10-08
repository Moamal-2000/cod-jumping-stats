"use client";

import { NAV_LINKS_DATA } from "@/Data/staticData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./FooterNav.module.scss";

const FooterNav = () => {
  const currentPage = usePathname();

  return (
    <nav className={s.navigation}>
      <h3>Navigation</h3>

      <ul className={s.links}>
        {NAV_LINKS_DATA.map(({ name, href, iconName, id }) => (
          <li key={id}>
            <Link href={href} className={currentPage === href ? s.active : ""}>
              <svg>
                <use href={`/icons-sprite.svg#${iconName}`} />
              </svg>
              <span>{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterNav;
