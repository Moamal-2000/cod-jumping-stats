import TopRunsTable from "../TopRunsTable/TopRunsTable";
import s from "./TopRunsContent.module.scss";

const TopRunsContent = ({
  visibleTopRunsFps,
  topRunsByFps,
  rankFilter,
  sortBy,
  sortOrder,
}) => {
  function getProcessedTopRuns() {
    let allRuns = [];

    Object.keys(visibleTopRunsFps).forEach((fps) => {
      if (
        visibleTopRunsFps[fps] &&
        topRunsByFps[fps] &&
        Object.keys(topRunsByFps[fps]).length > 0
      ) {
        // Process data for this FPS
        Object.keys(topRunsByFps[fps]).forEach((rank) => {
          if (
            topRunsByFps[fps][rank] &&
            Array.isArray(topRunsByFps[fps][rank])
          ) {
            allRuns = allRuns.concat(
              topRunsByFps[fps][rank].map((run) => ({
                ...run,
                rank: parseInt(rank),
                fps: fps, // Add FPS to each run
              }))
            );
          }
        });
      }
    });

    if (allRuns.length === 0) return [];

    // Enhance runs with FPS-specific jump-scores data
    allRuns = allRuns.map((run) => {
      let jumpScore = 0;
      let difficulty = null;

      // Get the jump scores for this run's FPS
      const fpsJumpScores = jumpScoresByFps[run.fps];
      if (fpsJumpScores?.map_scores) {
        // Find matching map score from the FPS-specific jump-scores API
        const mapScore = fpsJumpScores.map_scores.find(
          (ms) => ms.map_id === run.cpid || ms.map_name === run.mapname
        );

        if (mapScore) {
          jumpScore = mapScore.score || 0;
          difficulty = mapScore.difficulty;
        }
      }

      return {
        ...run,
        // Use FPS-specific jump-scores for scoring information, default to 0 if not found
        jumpScore: jumpScore,
        difficulty: difficulty,
        // Keep tops API data for rank and other details
        originalRank: run.rank,
        originalTotalNr: run.totalNr,
      };
    });

    let filteredRuns = allRuns;

    // Filter by rank
    if (rankFilter === "1") {
      filteredRuns = filteredRuns.filter((run) => run.rank === 1);
    } else if (rankFilter === "1-10") {
      filteredRuns = filteredRuns.filter(
        (run) => run.rank >= 1 && run.rank <= 10
      );
    }
    // "all" shows everything, no additional filtering needed

    // Sort the data
    filteredRuns.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "rank":
          comparison = a.rank - b.rank;
          break;
        case "time":
          comparison = a.time_played - b.time_played;
          break;
        case "date":
          comparison = new Date(a.time_created) - new Date(b.time_created);
          break;
        case "score":
          // Always use jump-scores (defaults to 0 if not found)
          const scoreA = a.jumpScore || 0;
          const scoreB = b.jumpScore || 0;
          comparison = scoreA - scoreB;
          break;
        default:
          comparison = a.rank - b.rank;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filteredRuns;
  }

  const processedRuns = getProcessedTopRuns();

  return (
    <div className={s.topRunsContent}>
      {processedRuns.length > 0 ? (
        <>
          <div>
            <div className={s.runsSummary}>
              <p>
                Showing {processedRuns.length} detailed run
                {processedRuns.length !== 1 ? "s" : ""}
                {rankFilter === "1"
                  ? " (Top 1 only)"
                  : rankFilter === "1-10"
                  ? " (Top 1-10)"
                  : " (All ranks)"}
              </p>
            </div>
            <TopRunsTable processedRuns={processedRuns} />
          </div>
        </>
      ) : (
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
