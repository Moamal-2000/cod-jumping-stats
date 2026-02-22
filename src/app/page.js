import ServersPage from "@/components/Pages/ServersPage/ServersPage";
import { Suspense } from "react";

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
