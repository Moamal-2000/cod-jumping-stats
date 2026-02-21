"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import GitHubStarBtn from "@/components/Shared/Buttons/GitHubStarBtn/GitHubStarBtn";
import ScrollToTopBtn from "@/components/Shared/Buttons/ScrollToTopBtn/ScrollToTopBtn";
import GitHubNotice from "@/components/Shared/GitHubNotice/GitHubNotice";
import GlobalOverlay from "@/components/Shared/GlobalOverlay/GlobalOverlay";
import LayoutLayer from "@/components/Shared/LayoutLayer/LayoutLayer";
import { store } from "@/redux/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";

const RootProviders = ({ children }) => {
  const pathname = usePathname();
  const currentPage = pathname === "/" ? "home" : pathname.slice(1);

  return (
    <Provider store={store}>
      <html lang="en" className={currentPage}>
        <body>
          <LayoutLayer>
            <Header />
            {children}
            <Footer />
            <ScrollToTopBtn />
            <GitHubStarBtn />
            <GitHubNotice />
            <GlobalOverlay />
          </LayoutLayer>
        </body>
      </html>
    </Provider>
  );
};

export default RootProviders;
