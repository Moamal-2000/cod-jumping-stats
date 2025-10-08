import { WEBSITE_NAME } from "@/Data/constants";
import Link from "next/link";
import s from "./WebsiteLogo.module.scss";

const WebsiteLogo = () => {
  return (
    <Link href="/" className={s.logo}>
      <svg>
        <use href="/badgesIcons.svg#jumpersHeaven" />
      </svg>
      <span>{WEBSITE_NAME}</span>
    </Link>
  );
};

export default WebsiteLogo;
