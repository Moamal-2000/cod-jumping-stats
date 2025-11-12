import CopyRights from "./CopyRights/CopyRights";
import s from "./Footer.module.scss";
import FooterContent from "./FooterContent/FooterContent";
import FooterStats from "./FooterStats/FooterStats";

const Footer = () => {
  return (
    <footer className={s.footer}>
      <hr className={s.line} />

      <div className="container" data-container>
        <FooterContent />
        <hr className={s.sectionsLine} />
        <FooterStats />
        <CopyRights />
      </div>
    </footer>
  );
};

export default Footer;
