import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ScrollToTopBtn from "@/components/Shared/Buttons/ScrollToTopBtn/ScrollToTopBtn";
import GlobalOverlay from "@/components/Shared/GlobalOverlay/GlobalOverlay";
import LayoutLayer from "@/components/Shared/LayoutLayer/LayoutLayer";
import "../styles/globals.scss";
import RootProviders from "./RootProviders";

export const metadata = {
  title: "Statistics | JumpersHeaven",
  description:
    "JumpersHeaven statistics platform for tracking servers, players, maps, favorites, and leaderboard performance.",
};

export default function RootLayout({ children }) {
  return (
    <RootProviders>
      <html lang="en">
        <body>
          <LayoutLayer>
            <Header />
            {children}
            <Footer />
            <ScrollToTopBtn />
            <GlobalOverlay />
          </LayoutLayer>
        </body>
      </html>
    </RootProviders>
  );
}
