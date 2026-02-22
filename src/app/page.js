import ServersPage from "@/components/Pages/ServersPage/ServersPage";
import { METADATA } from "@/data/metadata";
import { Suspense } from "react";

export const metadata = METADATA;

export default async function Servers() {
  return (
    <div className="container">
      <main>
        <Suspense>
          <ServersPage />
        </Suspense>
      </main>
    </div>
  );
}
