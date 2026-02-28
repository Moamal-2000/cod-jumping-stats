import { getProcessedTopRuns } from "@/lib/filters";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TopRunsTable from "../TopRunsTable/TopRunsTable";
import s from "./TopRunsContent.module.scss";

const TopRunsContent = () => {
  const topRuns = useSelector((s) => s.playerProfile.topRuns);
  const [processedTopRuns, setProcessedTopRuns] = useState(topRuns);

  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());
  const rankFilter = searchParams.get("rank") || "all";
  const sortFilter = searchParams.get("sort") || "rank";
  const orderFilter = searchParams.get("order") || "asc";

  const runSummeryText = getRunSummeryText({ processedTopRuns, rankFilter });
  const hasRuns = processedTopRuns.length > 0;

  useEffect(() => {
    setProcessedTopRuns(getProcessedTopRuns(topRuns, paramsObject));
  }, [rankFilter, sortFilter]);

  return (
    <div className={s.topRunsContent}>
      {hasRuns && (
        <div className={`${s.topRunsWrapper} ${s[orderFilter]}`}>
          <p className={s.runsSummary}>{runSummeryText}</p>
          <TopRunsTable topRuns={processedTopRuns} />
        </div>
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

function getRunSummeryText({ processedTopRuns, rankFilter }) {
  const rankFilterMap = {
    1: " (Top 1 only)",
    "1-10": " (Top 1-10)",
  };

  const rankFilterText = rankFilterMap[rankFilter] || " (All ranks)";
  const runWord = processedTopRuns.length === 1 ? "run" : "runs";

  return `Showing ${processedTopRuns.length} detailed ${runWord} ${rankFilterText}`;
}
