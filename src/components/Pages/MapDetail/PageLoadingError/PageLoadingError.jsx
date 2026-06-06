import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import SpinnerLoader from "@/components/Shared/Loaders/SpinnerLoader/SpinnerLoader";
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
            <TransitionLink href="/maps" className={s.backButton}>
              Go Maps Page
            </TransitionLink>
          </div>
        </div>
      </main>
    );
  }

  return null;
};

export default PageLoadingError;
