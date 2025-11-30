import WebsiteLogo from "../Shared/WebsiteLogo/WebsiteLogo";
import s from "./Header.module.scss";
import MainNav from "./MainNav/MainNav";
import MobileNavBtn from "./MobileNavBtn/MobileNavBtn";
import MobileNavMenu from "./MobileNavMenu/MobileNavMenu";

const Header = () => {
  return (
    <header className={s.header}>
      <div className="container" data-container>
        <WebsiteLogo />
        <MainNav />
        <MobileNavBtn />
        <MobileNavMenu />
      </div>
    </header>
  );
};

export default Header;
