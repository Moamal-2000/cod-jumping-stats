import "../styles/globals.scss";
import RootProviders from "./RootProviders";

export const metadata = {
  title: "Statistics | JumpersHeaven",
  description:
    "JumpersHeaven statistics platform for tracking servers, players, maps, favorites, and leaderboard performance.",
};

export default function RootLayout({ children }) {
  return <RootProviders>{children}</RootProviders>;
}
