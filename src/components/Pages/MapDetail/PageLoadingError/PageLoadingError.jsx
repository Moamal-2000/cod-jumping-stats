import SpinnerLoader from "@/components/Shared/Loaders/SpinnerLoader/SpinnerLoader";
import Link from "next/link";
import s from "./PageLoadingError.module.scss";

const PageLoadingError = ({ loading, error, mapData }) => {
  if (loading) {
    return (
      <main className={s.mapDetailPage}>
        <div className="container">
          <SpinnerLoader
            title="Loading map details..."
            description="Fetching map information and statistics"
          />
        </div>
      </main>
    );
  }

  if (error || !mapData) {
    return (
      <main className={s.mapDetailPage}>
        <div className="container">
          <div className={s.errorContainer}>
            <h2>Map Not Found</h2>
            <p>The requested map could not be found.</p>
            <Link href="/maps" className={s.backButton}>
              Go Maps Page
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return null;
};

export default PageLoadingError;
