import { WEBSITE_NAME } from "@/data/constants";
import Link from "next/link";
import s from "./WebsiteLogo.module.scss";

const WebsiteLogo = () => {
  return (
    <Link href="/" className={s.logo}>
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#jumpersHeaven" />
      </svg>
      <span>{WEBSITE_NAME}</span>
    </Link>
  );
};

export default WebsiteLogo;
