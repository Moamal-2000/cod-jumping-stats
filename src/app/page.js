import ServersPage from "@/components/Pages/ServersPage/ServersPage";
import { Suspense } from "react";

export const metadata = {
  title: "Servers | JumpersHeaven",
  description:
    "Browse active JumpersHeaven mod servers, monitor live player counts, and quickly jump to server-specific activity.",
};

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
