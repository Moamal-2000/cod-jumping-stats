import ServersPage from "@/components/Pages/ServersPage/ServersPage";
import { getOpenGraphMetadata } from "@/data/metadata";
import { Suspense } from "react";

export function generateMetadata() {
  return getOpenGraphMetadata();
}

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
