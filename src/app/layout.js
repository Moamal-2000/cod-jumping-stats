import { METADATA } from "@/data/metadata";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/globals.scss";
import "../styles/viewTransition.scss";
import RootProviders from "./RootProviders";

export const metadata = METADATA;

export default function RootLayout({ children }) {
  return (
    <RootProviders>
      {children}
      <SpeedInsights />
    </RootProviders>
  );
}
