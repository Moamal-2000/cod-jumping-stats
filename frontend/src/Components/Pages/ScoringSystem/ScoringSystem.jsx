"use client";

import PageHeader from "@/Components/Shared/PageHeroSection/PageHeroSection";
import { useRef, useState } from "react";
import s from "./ScoringSystem.module.scss";

const ScoringSystem = () => {
  const [activeTab, setActiveTab] = useState("route-completion");
  const tabRefs = useRef({});

  const tabs = [
    { id: "route-completion", label: "Route Completion" },
    { id: "speed", label: "Speedrun" },
    { id: "jump", label: "Skill Rating" },
    { id: "difficulty", label: "Map Difficulty" },
    { id: "overview", label: "Overview" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleKeyDown = (e, currentIndex) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case "ArrowRight":
        e.preventDefault();
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const newTab = tabs[newIndex];
    setActiveTab(newTab.id);
    tabRefs.current[newTab.id]?.focus();
  };

  return (
    <main className={s.scoringSystem}>
      <div className={s.container}>
        <PageHeader
          title="Leaderboard Scoring System"
          description="Discover how we determine player rankings through our comprehensive scoring system. Each leaderboard uses unique algorithms to ensure fair and accurate competition across different play styles."
        />

        <nav
          className={s.tabNavigation}
          role="tablist"
          aria-label="Scoring system categories"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`${s.tabButton} ${
                activeTab === tab.id ? s.active : ""
              }`}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className={s.content}>
          {/* Route Completion Leaderboard Section */}
          {activeTab === "route-completion" && (
            <section
              id="panel-route-completion"
              role="tabpanel"
              aria-labelledby="tab-route-completion"
              tabIndex={0}
              className={s.section}
            >
              <h2 className={s.sectionTitle}>Route Completion Leaderboard</h2>
              <p className={s.sectionIntro}>
                The Route Completion leaderboard tracks how many different
                routes you've completed. Since each map can contain multiple
                routes, we track individual route completions rather than map
                completions. The more unique routes you finish, the higher your
                score.
              </p>

              <div className={s.howItWorks}>
                <h3 className={s.subsectionTitle}>How It Works:</h3>
                <ul className={s.featureList}>
                  <li className={s.featureItem}>
                    <strong>Simple but Effective:</strong> You get 1 point for
                    each unique route you've completed
                  </li>
                  <li className={s.featureItem}>
                    <strong>Multiple Routes per Map:</strong> Each map can have
                    several different routes, so completing all routes on a
                    single map gives you multiple points
                  </li>
                  <li className={s.featureItem}>
                    <strong>No Penalties:</strong> Every route counts equally -
                    whether it's a beginner-friendly route or a nightmare
                    difficulty
                  </li>
                  <li className={s.featureItem}>
                    <strong>Pure Dedication:</strong> This leaderboard rewards
                    players who've tried everything in our route collection
                  </li>
                  <li className={s.featureItem}>
                    <strong>Real-Time Tracking:</strong> As soon as you finish a
                    new route, your score updates instantly
                  </li>
                </ul>
              </div>

              <div className={s.whyMatters}>
                <p className={s.whyMattersText}>
                  <strong>Why This Matters:</strong> The Route Completion
                  leaderboard rewards players who explore the full range of
                  available content. Since maps contain multiple routes, this
                  system encourages players to discover and complete all
                  possible paths, not just the most obvious ones.
                </p>
              </div>
            </section>
          )}

          {/* Speedrun Leaderboard Section */}
          {activeTab === "speed" && (
            <section
              id="panel-speed"
              role="tabpanel"
              aria-labelledby="tab-speed"
              tabIndex={0}
              className={s.section}
            >
              <h2 className={s.sectionTitle}>Speedrun Leaderboard</h2>
              <p className={s.sectionIntro}>
                The Speedrun leaderboard rewards consistent performance across
                multiple routes. Players who can consistently place in the top
                10 will rank higher.
              </p>

              <div className={s.scoringBreakdown}>
                <h3 className={s.subsectionTitle}>Scoring Breakdown:</h3>

                <div className={s.rankPoints}>
                  <h4 className={s.pointsTitle}>Rank-Based Points:</h4>
                  <div className={s.pointsGrid}>
                    <div className={s.pointItem}>
                      1st place ={" "}
                      <span className={s.pointValue}>100 points</span>
                    </div>
                    <div className={s.pointItem}>
                      2nd place ={" "}
                      <span className={s.pointValue}>80 points</span>
                    </div>
                    <div className={s.pointItem}>
                      3rd place ={" "}
                      <span className={s.pointValue}>60 points</span>
                    </div>
                    <div className={s.pointItem}>
                      4th place ={" "}
                      <span className={s.pointValue}>50 points</span>
                    </div>
                    <div className={s.pointItem}>
                      5th place ={" "}
                      <span className={s.pointValue}>40 points</span>
                    </div>
                    <div className={s.pointItem}>
                      6th place ={" "}
                      <span className={s.pointValue}>30 points</span>
                    </div>
                    <div className={s.pointItem}>
                      7th place ={" "}
                      <span className={s.pointValue}>20 points</span>
                    </div>
                    <div className={s.pointItem}>
                      8th place ={" "}
                      <span className={s.pointValue}>15 points</span>
                    </div>
                    <div className={s.pointItem}>
                      9th place ={" "}
                      <span className={s.pointValue}>10 points</span>
                    </div>
                    <div className={s.pointItem}>
                      10th place ={" "}
                      <span className={s.pointValue}>5 points</span>
                    </div>
                  </div>
                </div>

                <div className={s.multiplierSection}>
                  <h4 className={s.pointsTitle}>Multiplier Magic:</h4>
                  <p className={s.multiplierText}>
                    If you have multiple runs at the same rank, you get bonus
                    points! For example, if you have 3 runs at 2nd place, you
                    get 80 × 3 = <span className={s.highlight}>240 points</span>
                  </p>
                </div>

                <div className={s.rulesSection}>
                  <h4 className={s.pointsTitle}>Key Rules:</h4>
                  <ul className={s.rulesList}>
                    <li className={s.ruleItem}>
                      No Difficulty Adjustments: Every route is treated equally
                    </li>
                    <li className={s.ruleItem}>
                      Top 10 Only: Only your top 10 finishes count toward your
                      total score
                    </li>
                  </ul>
                </div>
              </div>

              <div className={s.strategySection}>
                <p className={s.strategyText}>
                  <strong>Strategy:</strong> This leaderboard rewards players
                  who can consistently perform well across many routes. Success
                  comes from being reliably good across multiple routes rather
                  than excelling at just one.
                </p>
              </div>
            </section>
          )}

          {/* Skill Rating Leaderboard Section */}
          {activeTab === "jump" && (
            <section
              id="panel-jump"
              role="tabpanel"
              aria-labelledby="tab-jump"
              tabIndex={0}
              className={s.section}
            >
              <h2 className={s.sectionTitle}>Skill Rating Leaderboard</h2>
              <p className={s.sectionIntro}>
                The Skill Rating leaderboard uses advanced scoring algorithms
                that factor in route difficulty, technical efficiency, and
                performance consistency to create a comprehensive skill ranking.
              </p>

              <div className={s.multiLayerSystem}>
                <h3 className={s.subsectionTitle}>
                  The Multi-Layer Scoring System:
                </h3>

                <div className={s.layerSection}>
                  <h4 className={s.layerTitle}>1. Base Point Foundation</h4>
                  <p className={s.layerDescription}>
                    Same rank-based points as Speed leaderboard (100, 80, 60,
                    etc.)
                    <br />
                    But here's where it gets interesting...
                  </p>
                </div>

                <div className={s.layerSection}>
                  <h4 className={s.layerTitle}>
                    2. Route Difficulty Integration
                  </h4>
                  <p className={s.layerDescription}>
                    Our system analyzes every route using machine
                    learning-inspired algorithms that consider:
                  </p>
                  <ul className={s.algorithmList}>
                    <li className={s.algorithmItem}>
                      Time Progression Analysis: How much time separates top
                      players from each other
                    </li>
                    <li className={s.algorithmItem}>
                      Save/Load Behavior Patterns: How often players need to
                      restart (indicates difficulty)
                    </li>
                    <li className={s.algorithmItem}>
                      Completion Time Distribution: How long it takes players to
                      finish
                    </li>
                    <li className={s.algorithmItem}>
                      Player Struggle Metrics: The ratio of attempts to
                      successful completions
                    </li>
                  </ul>

                  <div className={s.difficultyScoring}>
                    <h5 className={s.difficultyTitle}>Difficulty Scoring:</h5>
                    <ul className={s.difficultyList}>
                      <li className={s.difficultyItem}>
                        Routes get rated on a 0-10 scale
                      </li>
                      <li className={s.difficultyItem}>
                        Your base points get multiplied by the route's
                        difficulty
                      </li>
                      <li className={s.difficultyItem}>
                        <strong>Example:</strong> 1st place (100 points) on a
                        difficulty 8 route =
                        <span className={s.highlight}> 800 points!</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={s.layerSection}>
                  <h4 className={s.layerTitle}>
                    3. The Difficulty Penalty/Bonus System
                  </h4>
                  <p className={s.layerDescription}>
                    The system applies different scoring modifiers based on
                    route difficulty:
                  </p>

                  <div className={s.penaltyBonusGrid}>
                    <div className={s.penaltySection}>
                      <h5 className={s.penaltyTitle}>
                        For Easier Routes (Difficulty &le; 4):
                      </h5>
                      <ul className={s.penaltyList}>
                        <li className={s.penaltyItem}>
                          Progressive Penalty: Points multiplied by (0.05 ×
                          difficulty)
                        </li>
                        <li className={s.penaltyItem}>
                          Why: We want to encourage players to tackle harder
                          content
                        </li>
                        <li className={s.penaltyItem}>
                          <strong>Examples:</strong>
                          <br />
                          • Difficulty 1: 5% of base points
                          <br />
                          • Difficulty 2: 10% of base points
                          <br />• Difficulty 4: 20% of base points
                        </li>
                      </ul>
                    </div>

                    <div className={s.bonusSection}>
                      <h5 className={s.bonusTitle}>
                        For Harder Routes (Difficulty &gt; 4):
                      </h5>
                      <ul className={s.bonusList}>
                        <li className={s.bonusItem}>
                          Progressive Bonus: Points multiplied by (1 + 0.1 ×
                          (difficulty - 4))
                        </li>
                        <li className={s.bonusItem}>
                          Why: We want to reward players who take on the
                          toughest challenges
                        </li>
                        <li className={s.bonusItem}>
                          <strong>Examples:</strong>
                          <br />
                          • Difficulty 5: 100% of base points (no penalty/bonus)
                          <br />
                          • Difficulty 6: 120% of base points
                          <br />• Difficulty 10: 160% of base points
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={s.layerSection}>
                  <h4 className={s.layerTitle}>
                    4. The Technical Precision Penalty
                  </h4>
                  <p className={s.layerDescription}>
                    The system also factors in technical efficiency:
                  </p>
                  <ul className={s.precisionList}>
                    <li className={s.precisionItem}>
                      Nadejump Analysis: We track how many grenade jumps you use
                      compared to the world record
                    </li>
                    <li className={s.precisionItem}>
                      Efficiency Penalty: 20% penalty for each extra nadejump
                    </li>
                    <li className={s.precisionItem}>
                      Why: This rewards players who find the most efficient
                      routes and techniques
                    </li>
                    <li className={s.precisionItem}>
                      <strong>Example:</strong> If the world record uses 2
                      nadejumps and you use 4, you get a
                      <span className={s.highlight}> 40% penalty</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={s.formulaSection}>
                <h3 className={s.subsectionTitle}>
                  The Complete Jump Scoring Formula:
                </h3>
                <div className={s.formulaBox}>
                  <div className={s.formulaStep}>
                    <span className={s.stepNumber}>1</span>
                    <span className={s.stepText}>
                      Base Points (100, 80, 60, etc.)
                    </span>
                  </div>
                  <div className={s.formulaArrow}>×</div>
                  <div className={s.formulaStep}>
                    <span className={s.stepNumber}>2</span>
                    <span className={s.stepText}>
                      Route Difficulty (0-10 scale)
                    </span>
                  </div>
                  <div className={s.formulaArrow}>×</div>
                  <div className={s.formulaStep}>
                    <span className={s.stepNumber}>3</span>
                    <span className={s.stepText}>Difficulty Bonus/Penalty</span>
                  </div>
                  <div className={s.formulaArrow}>×</div>
                  <div className={s.formulaStep}>
                    <span className={s.stepNumber}>4</span>
                    <span className={s.stepText}>Efficiency Multiplier</span>
                  </div>
                </div>

                <div className={s.exampleSection}>
                  <h4 className={s.exampleTitle}>Real Example:</h4>
                  <div className={s.exampleSteps}>
                    <div className={s.exampleStep}>
                      You get 1st place on a difficulty 7 route
                    </div>
                    <div className={s.exampleStep}>
                      Base points: <span className={s.highlight}>100</span>
                    </div>
                    <div className={s.exampleStep}>
                      Difficulty multiplier: 100 × 7 ={" "}
                      <span className={s.highlight}>700 points</span>
                    </div>
                    <div className={s.exampleStep}>
                      Difficulty bonus: 700 × (1 + 0.1 × (7-4)) = 700 × 1.3 ={" "}
                      <span className={s.highlight}>910 points</span>
                    </div>
                    <div className={s.exampleStep}>
                      Technical penalty: 910 × 0.8 ={" "}
                      <span className={s.highlight}>728 points</span> (if you
                      used 1 extra nadejump)
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Map Difficulty Section */}
          {activeTab === "difficulty" && (
            <section
              id="panel-difficulty"
              role="tabpanel"
              aria-labelledby="tab-difficulty"
              tabIndex={0}
              className={s.section}
            >
              <h2 className={s.sectionTitle}>Map Difficulty System</h2>
              <p className={s.sectionIntro}>
                Your map rating system automatically calculates difficulty
                scores (0-10) for each map based on how players actually perform
                on them, creating a dynamic difficulty assessment that evolves
                with the community.
              </p>

              <div className={s.howItWorks}>
                <h3 className={s.subsectionTitle}>How It Works:</h3>

                <div className={s.stepsGrid}>
                  <div className={s.stepCard}>
                    <h4 className={s.stepTitle}>1. Data Collection</h4>
                    <p className={s.stepDescription}>
                      The system gathers comprehensive performance data from the
                      community
                    </p>
                    <div className={s.stepFeatures}>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Top 100 Analysis</strong>
                          <span>Analyzes the top 100 runs for each map</span>
                        </div>
                      </div>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>FPS-Specific</strong>
                          <span>
                            Calculates separately for each FPS setting (125,
                            250, 333...)
                          </span>
                        </div>
                      </div>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Quality Control</strong>
                          <span>
                            Filters out invalid runs (&gt;3 nadejumps,
                            defrag/surf maps)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={s.stepCard}>
                    <h4 className={s.stepTitle}>2. Performance Analysis</h4>
                    <p className={s.stepDescription}>
                      Advanced algorithms analyze 8 key performance indicators
                    </p>
                    <div className={s.stepFeatures}>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Time Gaps</strong>
                          <span>How much time separates top players</span>
                        </div>
                      </div>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Struggle Metrics</strong>
                          <span>
                            How often players save/reload (indicates difficulty)
                          </span>
                        </div>
                      </div>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Completion Times</strong>
                          <span>How long it takes to finish</span>
                        </div>
                      </div>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Rarity Factor</strong>
                          <span>How few people have completed it</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={s.stepCard}>
                    <h4 className={s.stepTitle}>3. Smart Normalization</h4>
                    <p className={s.stepDescription}>
                      Mathematical processing ensures fair and balanced scoring
                    </p>
                    <div className={s.stepFeatures}>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Exponential Decay</strong>
                          <span>
                            Uses exponential decay to scale all metrics 0-1
                          </span>
                        </div>
                      </div>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Outlier Protection</strong>
                          <span>Prevents extreme outliers from dominating</span>
                        </div>
                      </div>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Balanced Distribution</strong>
                          <span>Creates balanced difficulty distribution</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={s.stepCard}>
                    <h4 className={s.stepTitle}>4. Final Scoring</h4>
                    <p className={s.stepDescription}>
                      All metrics are combined to create the final difficulty
                      rating
                    </p>
                    <div className={s.stepFeatures}>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Metric Combination</strong>
                          <span>
                            Combines all 8 metrics into base difficulty
                          </span>
                        </div>
                      </div>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Rarity Bonus</strong>
                          <span>
                            Adds rarity bonus for maps with few completions
                          </span>
                        </div>
                      </div>
                      <div className={s.stepFeature}>
                        <div className={s.featureContent}>
                          <strong>Final Scale</strong>
                          <span>Scales to 0-10 final score</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={s.keyFeatures}>
                <h3 className={s.subsectionTitle}>Key Features:</h3>
                <div className={s.featuresGrid}>
                  <div className={s.featureCard}>
                    <h4 className={s.featureCardTitle}>Adaptive Scaling</h4>
                    <p className={s.featureCardDescription}>
                      Each FPS setting has its own difficulty scale, ensuring
                      fair comparison across different play styles
                    </p>
                  </div>
                  <div className={s.featureCard}>
                    <h4 className={s.featureCardTitle}>
                      Multi-dimensional Analysis
                    </h4>
                    <p className={s.featureCardDescription}>
                      Considers 8 different metrics including time gaps,
                      struggle patterns, and completion rarity
                    </p>
                  </div>
                  <div className={s.featureCard}>
                    <h4 className={s.featureCardTitle}>Quality Control</h4>
                    <p className={s.featureCardDescription}>
                      Automatically filters out invalid runs and outliers to
                      maintain data integrity
                    </p>
                  </div>
                  <div className={s.featureCard}>
                    <h4 className={s.featureCardTitle}>Real-time Updates</h4>
                    <p className={s.featureCardDescription}>
                      Difficulty scores update instantly as new runs are
                      submitted, keeping ratings current
                    </p>
                  </div>
                  <div className={s.featureCard}>
                    <h4 className={s.featureCardTitle}>Objective Fairness</h4>
                    <p className={s.featureCardDescription}>
                      Based entirely on actual player performance data, not
                      subjective opinions or arbitrary ratings
                    </p>
                  </div>
                  <div className={s.featureCard}>
                    <h4 className={s.featureCardTitle}>Self-Improving</h4>
                    <p className={s.featureCardDescription}>
                      The system learns and adapts as the community's skill
                      level evolves and new strategies emerge
                    </p>
                  </div>
                </div>
              </div>

              <div className={s.difficultyScale}>
                <h3 className={s.subsectionTitle}>Difficulty Scale:</h3>
                <p className={s.scaleDescription}>
                  Every map receives a difficulty rating from 0 to 10 based on
                  real player performance data. This dynamic system ensures
                  ratings accurately reflect the true challenge level of each
                  map.
                </p>
                <div className={s.scaleGrid}>
                  <div className={`${s.scaleItem} ${s.veryEasy}`}>
                    <span className={s.scaleRange}>0-2</span>
                    <span className={s.scaleLabel}>Very Easy</span>
                    <span className={s.scaleDescription}>
                      Beginner-friendly maps with quick completions
                    </span>
                  </div>
                  <div className={`${s.scaleItem} ${s.easy}`}>
                    <span className={s.scaleRange}>2-4</span>
                    <span className={s.scaleLabel}>Easy</span>
                    <span className={s.scaleDescription}>
                      Low skill requirement with minimal struggle
                    </span>
                  </div>
                  <div className={`${s.scaleItem} ${s.medium}`}>
                    <span className={s.scaleRange}>4-6</span>
                    <span className={s.scaleLabel}>Medium</span>
                    <span className={s.scaleDescription}>
                      Moderate challenge requiring practice
                    </span>
                  </div>
                  <div className={`${s.scaleItem} ${s.hard}`}>
                    <span className={s.scaleRange}>6-8</span>
                    <span className={s.scaleLabel}>Hard</span>
                    <span className={s.scaleDescription}>
                      High skill required with significant difficulty
                    </span>
                  </div>
                  <div className={`${s.scaleItem} ${s.veryHard}`}>
                    <span className={s.scaleRange}>8-10</span>
                    <span className={s.scaleLabel}>Very Hard</span>
                    <span className={s.scaleDescription}>
                      Expert level requiring extreme dedication
                    </span>
                  </div>
                </div>
              </div>

              <div className={s.whyEffective}>
                <h3 className={s.subsectionTitle}>Why It's Effective:</h3>

                <div className={s.effectivenessGrid}>
                  <div className={s.effectivenessCard}>
                    <h4 className={s.effectivenessTitle}>
                      Data-Driven Accuracy
                    </h4>
                    <p className={s.effectivenessDescription}>
                      Uses real player performance metrics instead of subjective
                      opinions, ensuring difficulty ratings reflect actual
                      challenge levels.
                    </p>
                  </div>

                  <div className={s.effectivenessCard}>
                    <h4 className={s.effectivenessTitle}>
                      Precise Measurement
                    </h4>
                    <p className={s.effectivenessDescription}>
                      Tracks 8 different indicators including time gaps,
                      struggle patterns, and completion rates to create
                      comprehensive difficulty assessments.
                    </p>
                  </div>

                  <div className={s.effectivenessCard}>
                    <h4 className={s.effectivenessTitle}>Dynamic Adaptation</h4>
                    <p className={s.effectivenessDescription}>
                      Automatically adjusts as community skill evolves and new
                      strategies are discovered, keeping ratings relevant and
                      fair.
                    </p>
                  </div>
                </div>

                <div className={s.effectivenessSummary}>
                  <h4 className={s.summaryTitle}>The Result:</h4>
                  <p className={s.summaryText}>
                    A living difficulty system that accurately reflects the true
                    challenge of each map, helping players find content that
                    matches their skill level while rewarding those who push
                    their limits on the most demanding routes.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Overview Section */}
          {activeTab === "overview" && (
            <section
              id="panel-overview"
              role="tabpanel"
              aria-labelledby="tab-overview"
              tabIndex={0}
              className={s.section}
            >
              <h2 className={s.sectionTitle}>System Overview</h2>
              <p className={s.sectionIntro}>
                Our system creates a multi-dimensional competitive environment:
              </p>

              <div className={s.bigPictureGrid}>
                <div className={s.leaderboardCard}>
                  <h3 className={s.cardTitle}>Route Completion</h3>
                  <p className={s.cardDescription}>
                    Rewards exploration and dedication
                  </p>
                </div>

                <div className={s.leaderboardCard}>
                  <h3 className={s.cardTitle}>Speed</h3>
                  <p className={s.cardDescription}>
                    Rewards consistency and reliability
                  </p>
                </div>

                <div className={s.leaderboardCard}>
                  <h3 className={s.cardTitle}>Jump</h3>
                  <p className={s.cardDescription}>
                    Rewards technical mastery and strategic thinking
                  </p>
                </div>
              </div>

              <div className={s.conclusion}>
                <p className={s.conclusionText}>
                  Each leaderboard tells a different story about player skill,
                  ensuring that different types of players can find their niche
                  and compete meaningfully. Whether you're a completionist, a
                  consistent performer, or a technical master, there's a
                  leaderboard that celebrates your unique strengths!
                </p>

                <p className={s.finalText}>
                  The system evolves with the community - as new routes are
                  added and new techniques are discovered, the difficulty
                  ratings and scoring adapt to maintain fair competition and
                  accurate skill assessment.
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </main>
  );
};

export default ScoringSystem;
