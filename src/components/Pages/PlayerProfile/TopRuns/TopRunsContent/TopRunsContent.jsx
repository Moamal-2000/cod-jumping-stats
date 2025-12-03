import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import TopRunsTable from "../TopRunsTable/TopRunsTable";
import s from "./TopRunsContent.module.scss";

const TopRunsContent = () => {
  const topRuns = useSelector((s) => s.playerProfile.topRuns);
  const searchParams = useSearchParams();
  const rankFilter = searchParams.get("rankFilter") || "1-10";

  const runSummeryText = getRunSummeryText({ topRuns, rankFilter });
  const hasRuns = topRuns.length > 0;

  return (
    <div className={s.topRunsContent}>
      {hasRuns && (
        <>
          <div>
            <div className={s.runsSummary}>
              <p>{runSummeryText}</p>
            </div>
            <TopRunsTable topRuns={topRuns} />
          </div>
        </>
      )}

      {!hasRuns && (
        <div className={s.emptyState}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#star" />
          </svg>
          {/* <p>No runs found for the selected filters.</p> */}
          <strong>Under development, coming soon, please be patient.</strong>
        </div>
      )}
    </div>
  );
};

export default TopRunsContent;

function getRunSummeryText({ topRuns, rankFilter }) {
  const rankFilterMap = {
    1: " (Top 1 only)",
    "1-10": " (Top 1-10)",
  };

  const rankFilterText = rankFilterMap[rankFilter] || " (All ranks)";
  const runWord = topRuns.length === 1 ? "run" : "runs";

  return `Showing ${topRuns.length} detailed ${runWord} ${rankFilterText}`;
}
