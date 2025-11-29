import TopRunsTable from "../TopRunsTable/TopRunsTable";
import s from "./TopRunsContent.module.scss";

const TopRunsContent = ({
  visibleTopRunsFps,
  topRunsByFps,
  rankFilter,
  sortBy,
  sortOrder,
}) => {
  const processedRuns = [];
  const runSummeryText = getRunSummeryText({ processedRuns, rankFilter });
  const hasRuns = processedRuns.length > 0;

  return (
    <div className={s.topRunsContent}>
      {hasRuns && (
        <>
          <div>
            <div className={s.runsSummary}>
              <p>{runSummeryText}</p>
            </div>
            <TopRunsTable processedRuns={processedRuns} />
          </div>
        </>
      )}

      {!hasRuns && (
        <div className={s.emptyState}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#star" />
          </svg>
          <p>No runs found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default TopRunsContent;

const jumpScoresByFps = {
  125: null,
  250: null,
  mix: null,
  333: null,
  76: null,
  43: null,
};

function getRunSummeryText({ processedRuns, rankFilter }) {
  const rankFilterMap = {
    1: " (Top 1 only)",
    "1-10": " (Top 1-10)",
  };

  const rankFilterText = rankFilterMap[rankFilter] || " (All ranks)";
  const runWord = processedRuns.length === 1 ? "run" : "runs";

  return `Showing ${processedRuns.length} detailed ${runWord} ${rankFilterText}`;
}
