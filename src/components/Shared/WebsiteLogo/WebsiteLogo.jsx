import { WEBSITE_NAME } from "@/data/constants";
import Image from "next/image";
import TransitionLink from "../Links/TransitionLink/TransitionLink";
import s from "./WebsiteLogo.module.scss";

const WebsiteLogo = () => {
  return (
    <TransitionLink href="/" className={s.logo}>
      <Image
        src="/logo.svg"
        alt="Jumpers Heaven"
        width="64"
        height="64"
        quality={25}
        preload
      />
      <span>{WEBSITE_NAME}</span>
    </TransitionLink>
  );
};

export default WebsiteLogo;
