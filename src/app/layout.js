import { METADATA } from "@/data/metadata";
import "../styles/globals.scss";
import RootProviders from "./RootProviders";

export const metadata = METADATA;

export default function RootLayout({ children }) {
  return <RootProviders>{children}</RootProviders>;
}
