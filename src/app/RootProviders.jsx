"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import GitHubStarBtn from "@/components/Shared/Buttons/GitHubStarBtn/GitHubStarBtn";
import PlayerProfileButton from "@/components/Shared/Buttons/PlayerProfileButton/PlayerProfileButton";
import ScrollToTopBtn from "@/components/Shared/Buttons/ScrollToTopBtn/ScrollToTopBtn";
import GitHubNotice from "@/components/Shared/GitHubNotice/GitHubNotice";
import GlobalOverlay from "@/components/Shared/GlobalOverlay/GlobalOverlay";
import LayoutLayer from "@/components/Shared/LayoutLayer/LayoutLayer";
import CopiedPopup from "@/components/Shared/Popups/CopiedPopup/CopiedPopup";
import { store } from "@/redux/store";
import { ViewTransitions } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";

const RootProviders = ({ children }) => {
  const pathname = usePathname();
  const currentPage = pathname === "/" ? "home" : pathname.slice(1);

  return (
    <ViewTransitions>
      <Provider store={store}>
        <html lang="en" className={currentPage}>
          <head>
            <link rel="preconnect" href="https://jhstats.fly.dev" />
          </head>

          <body>
            <Header />
            <LayoutLayer>
              <GitHubStarBtn />
              <PlayerProfileButton />
              {children}
              <Footer />
              <ScrollToTopBtn />
              <GitHubNotice />
              <GlobalOverlay />
              <CopiedPopup />
            </LayoutLayer>
          </body>
        </html>
      </Provider>
    </ViewTransitions>
  );
};

export default RootProviders;
