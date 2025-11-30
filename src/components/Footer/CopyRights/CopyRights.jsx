import { WEBSITE_NAME } from "@/data/constants";
import s from "./CopyRights.module.scss";

const CopyRights = () => {
  return (
    <p className={s.copyRight}>
      © {currentYear} <span>{WEBSITE_NAME}</span>. All rights reserved.
    </p>
  );
};

export default CopyRights;

const currentYear = new Date().getFullYear();
