import { getFilteredTopRuns } from "@/functions/filters";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TopRunsTable from "../TopRunsTable/TopRunsTable";
import s from "./TopRunsContent.module.scss";

const TopRunsContent = () => {
  const topRuns = useSelector((s) => s.playerProfile.topRuns);
  const [filteredTopRuns, setFilteredTopRuns] = useState(topRuns);

  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());
  const rankFilter = searchParams.get("rank") || "all";

  useEffect(() => {
    const filterTopRuns = getFilteredTopRuns(topRuns, paramsObject);

    setFilteredTopRuns(filterTopRuns);
  }, [rankFilter]);

  const runSummeryText = getRunSummeryText({ filteredTopRuns, rankFilter });
  const hasRuns = filteredTopRuns.length > 0;

  return (
    <div className={s.topRunsContent}>
      {hasRuns && (
        <>
          <div>
            <div className={s.runsSummary}>
              <p>{runSummeryText}</p>
            </div>
            <TopRunsTable topRuns={filteredTopRuns} />
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

function getRunSummeryText({ filteredTopRuns, rankFilter }) {
  const rankFilterMap = {
    1: " (Top 1 only)",
    "1-10": " (Top 1-10)",
  };

  const rankFilterText = rankFilterMap[rankFilter] || " (All ranks)";
  const runWord = filteredTopRuns.length === 1 ? "run" : "runs";

  return `Showing ${filteredTopRuns.length} detailed ${runWord} ${rankFilterText}`;
}
