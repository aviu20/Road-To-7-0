import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy, Play, FastForward } from "lucide-react";

// ─── Pre-match narratives based on round ──────────────────
const preMatchLines = {
  "Group — Match 1": "The tournament begins. Time to set the tone.",
  "Group — Match 2": "One down — can your XI build momentum?",
  "Group — Match 3": "The final group game. Everything on the line.",
  "Round of 16": "Knockout football. No second chances now.",
  "Quarter-Final": "The last eight. Every tackle matters.",
  "Semi-Final": "One game from the Final. History beckons.",
  "Final": "This is it. The World Cup Final.",
};

function getPostMatchLine(match) {
  const { result, teamGoals, oppGoals, opponent } = match;
  if (result === "W" && teamGoals >= 3) return `A dominant display against ${opponent}. The squad is firing.`;
  if (result === "W" && oppGoals === 0) return `Clean sheet! ${opponent} had no answer.`;
  if (result === "W") return `A hard-fought win over ${opponent}. Three points secured.`;
  if (result === "D") return `A tense draw with ${opponent}. Points shared.`;
  if (result === "L" && oppGoals - teamGoals >= 3) return `Outclassed by ${opponent}. A humbling defeat.`;
  if (result === "L") return `${opponent} edged it. A bitter loss.`;
  return "";
}

export default function TournamentPhase({ results, groupTable, onComplete }) {
  const [visibleMatches, setVisibleMatches] = useState(0);
  const [animatingMatch, setAnimatingMatch] = useState(null);

  const groupMatches = results.filter((r) => r.round.startsWith("Group"));
  const knockoutMatches = results.filter((r) => !r.round.startsWith("Group"));
  const isGroupDone = visibleMatches >= groupMatches.length;
  const knockoutVisible = Math.max(0, visibleMatches - groupMatches.length);
  const allRevealed = visibleMatches >= results.length;

  const handlePlayMatch = () => {
    if (allRevealed) {
      onComplete();
    } else if (animatingMatch === null) {
      setAnimatingMatch(visibleMatches);
    }
  };

  const handleAnimationComplete = useCallback(() => {
    setVisibleMatches((v) => v + 1);
    setAnimatingMatch(null);
  }, []);

  const handleSkip = useCallback(() => {
    // Skip current animation — immediately complete the match
    setVisibleMatches((v) => v + 1);
    setAnimatingMatch(null);
  }, []);

  const currentAnimIdx = animatingMatch;

  // Progressive group table: only show stats for matches already revealed
  const progressiveTable = groupTable ? groupTable.map((team) => {
    if (!team.isUser) return team;
    // Recalculate user stats based on visible matches only
    const visible = groupMatches.slice(0, visibleMatches);
    const w = visible.filter((m) => m.result === "W").length;
    const d = visible.filter((m) => m.result === "D").length;
    const l = visible.filter((m) => m.result === "L").length;
    const gf = visible.reduce((s, m) => s + m.teamGoals, 0);
    const ga = visible.reduce((s, m) => s + m.oppGoals, 0);
    return {
      ...team,
      played: visibleMatches,
      wins: w, draws: d, losses: l,
      goalsFor: gf, goalsAgainst: ga,
      points: w * 3 + d,
    };
  }) : null;

  // Get the next match to be played (for pre-match narrative)
  const nextMatchIdx = animatingMatch !== null ? animatingMatch : visibleMatches;
  const nextMatch = results[nextMatchIdx];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-10 h-10 text-gold mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-white">Tournament</h2>
          <p className="text-gray-400">Your legends take the field...</p>
        </div>

        {/* Group Table — progressive stats */}
        {progressiveTable && visibleMatches > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-surface border border-gray-700">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Group Standings</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="text-left pb-2 pr-2">#</th>
                  <th className="text-left pb-2">Team</th>
                  <th className="text-center pb-2 w-8">P</th>
                  <th className="text-center pb-2 w-8">W</th>
                  <th className="text-center pb-2 w-8">D</th>
                  <th className="text-center pb-2 w-8">L</th>
                  <th className="text-center pb-2 w-10">GD</th>
                  <th className="text-center pb-2 w-10 font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {progressiveTable.map((team, i) => {
                  const gd = team.goalsFor - team.goalsAgainst;
                  const qualified = i < 2 && isGroupDone;
                  return (
                    <tr
                      key={team.name}
                      className={`border-t border-gray-700/50 ${
                        team.isUser ? "text-emerald-accent font-semibold" : "text-gray-300"
                      } ${qualified ? "bg-emerald-accent/5" : i >= 2 && isGroupDone ? "opacity-50" : ""}`}
                    >
                      <td className="py-2 pr-2 text-gray-500">{i + 1}</td>
                      <td className="py-2">{team.isUser ? "Your XI" : team.name}</td>
                      <td className="text-center py-2">{team.played}</td>
                      <td className="text-center py-2">{team.wins}</td>
                      <td className="text-center py-2">{team.draws}</td>
                      <td className="text-center py-2">{team.losses}</td>
                      <td className="text-center py-2">{gd > 0 ? `+${gd}` : gd}</td>
                      <td className="text-center py-2 font-bold">{team.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {isGroupDone && (
              <div className="mt-2 text-xs text-gray-500">
                Top 2 qualify for the knockout rounds
              </div>
            )}
          </div>
        )}

        {/* Group Matches */}
        {groupMatches.length > 0 && (visibleMatches > 0 || currentAnimIdx !== null) && (
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Group Stage</h3>
            <div className="space-y-3">
              {groupMatches.slice(0, visibleMatches).map((match, i) => (
                <MatchCard key={`g${i}`} match={match} />
              ))}
              {currentAnimIdx !== null && currentAnimIdx < groupMatches.length && (
                <LiveMatchCard
                  key={`g-live-${currentAnimIdx}`}
                  match={groupMatches[currentAnimIdx]}
                  onComplete={handleAnimationComplete}
                  onSkip={handleSkip}
                />
              )}
            </div>
          </div>
        )}

        {/* Knockout Matches */}
        {isGroupDone && (knockoutVisible > 0 || (currentAnimIdx !== null && currentAnimIdx >= groupMatches.length)) && (
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 mt-6">Knockout Rounds</h3>
            <div className="space-y-3">
              {knockoutMatches.slice(0, knockoutVisible).map((match, i) => (
                <MatchCard key={`k${i}`} match={match} />
              ))}
              {currentAnimIdx !== null && currentAnimIdx >= groupMatches.length && (
                <LiveMatchCard
                  key={`k-live-${currentAnimIdx}`}
                  match={knockoutMatches[currentAnimIdx - groupMatches.length]}
                  onComplete={handleAnimationComplete}
                  onSkip={handleSkip}
                />
              )}
            </div>
          </div>
        )}

        {/* Post-match story beat */}
        {visibleMatches > 0 && animatingMatch === null && !allRevealed && (
          <div className="text-center my-4 animate-fade-in">
            <p className="text-sm text-gray-400 italic">
              {getPostMatchLine(results[visibleMatches - 1])}
            </p>
          </div>
        )}

        {/* Pre-match narrative */}
        {!allRevealed && animatingMatch === null && nextMatch && (
          <div className="text-center mt-2 mb-4">
            <p className="text-xs text-gray-500">
              Next: <span className="text-white font-medium">Your XI vs {nextMatch.opponent}</span>
              {" · "}{preMatchLines[nextMatch.round] || ""}
            </p>
          </div>
        )}

        {/* Play Match / Continue Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handlePlayMatch}
            disabled={animatingMatch !== null}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer
                       ${animatingMatch !== null
                         ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                         : "bg-emerald-accent text-white hover:bg-emerald-600 active:scale-95"
                       }`}
          >
            {allRevealed ? (
              <>
                <Trophy className="w-5 h-5" />
                See Results
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {visibleMatches === 0 && animatingMatch === null ? "Start Tournament" : "Play Next Match"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Event styling ──────────────────────────────────
const eventStyles = {
  goal:      { playerColor: "text-emerald-accent", oppColor: "text-red-300" },
  freekick:  { playerColor: "text-emerald-accent", oppColor: "text-red-300" },
  penalty:   { playerColor: "text-emerald-accent", oppColor: "text-red-300" },
  save:      { playerColor: "text-blue-300", oppColor: "text-blue-300" },
  yellow:    { playerColor: "text-yellow-300", oppColor: "text-yellow-300" },
  red:       { playerColor: "text-red-400", oppColor: "text-red-400" },
  halftime:  { playerColor: "text-gray-500", oppColor: "text-gray-500" },
  fulltime:  { playerColor: "text-gray-300 font-semibold", oppColor: "text-gray-300 font-semibold" },
  info:      { playerColor: "text-gray-500", oppColor: "text-gray-500" },
};

function MatchEvent({ event, animate = false }) {
  const style = eventStyles[event.type] || eventStyles.info;
  const isBreak = event.type === "halftime" || event.type === "fulltime";
  const isNeutral = event.team === "neutral";
  const animClass = animate ? "animate-fade-in" : "";

  if (isBreak) {
    return (
      <div className={`text-xs text-center py-1.5 my-1 border-y border-gray-700/50 ${
        event.type === "fulltime" ? "text-gray-300 font-semibold" : "text-gray-500"
      } ${animClass}`}>
        {event.text}
      </div>
    );
  }

  const colorClass = isNeutral
    ? "text-gray-500 italic"
    : event.team === "player" ? style.playerColor : style.oppColor;

  return (
    <div className={`text-xs ${colorClass} flex items-start gap-1.5 py-0.5 ${animClass}`}>
      <span className="shrink-0 w-4 text-center leading-4">{isNeutral ? "•" : ""}</span>
      <span className="leading-4">{event.text}</span>
    </div>
  );
}

// ─── Live match card with skip button ──
function LiveMatchCard({ match, onComplete, onSkip }) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [scoreRevealed, setScoreRevealed] = useState(false);
  const containerRef = useRef(null);
  const events = match.events || [];
  const allEventsShown = revealedCount >= events.length;

  useEffect(() => {
    if (revealedCount < events.length) {
      const delay = getEventDelay(events[revealedCount]);
      const timer = setTimeout(() => setRevealedCount((c) => c + 1), delay);
      return () => clearTimeout(timer);
    } else if (!scoreRevealed) {
      const timer = setTimeout(() => setScoreRevealed(true), 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, scoreRevealed, events.length, onComplete]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [revealedCount]);

  const runningScore = { team: 0, opp: 0 };
  for (let i = 0; i < revealedCount; i++) {
    const ev = events[i];
    if (ev.type === "goal" || ev.type === "freekick" || ev.type === "penalty") {
      if (ev.team === "player") runningScore.team++;
      else if (ev.team === "opponent") runningScore.opp++;
    }
  }

  const resultColors = {
    W: "border-emerald-accent/50 bg-emerald-accent/5",
    D: "border-gold/50 bg-gold/5",
    L: "border-red-400/50 bg-red-400/5",
  };
  const resultLabels = { W: "WIN", D: "DRAW", L: "LOSS" };
  const resultTextColors = { W: "text-emerald-accent", D: "text-gold", L: "text-red-400" };

  return (
    <div className={`p-4 rounded-xl border transition-all duration-500 ${
      scoreRevealed ? resultColors[match.result] : "border-emerald-accent/30 bg-emerald-accent/5"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            {match.round}
            {!scoreRevealed && (
              <span className="inline-flex items-center gap-1 text-emerald-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div className="text-white font-medium">
            Your XI <span className="text-gray-400">vs</span> {match.opponent}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Skip button */}
          {!scoreRevealed && (
            <button
              onClick={(e) => { e.stopPropagation(); onSkip(); }}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 hover:text-gray-300
                         hover:bg-gray-700/50 transition-colors cursor-pointer"
              title="Skip animation"
            >
              <FastForward className="w-3 h-3" />
              Skip
            </button>
          )}
          <div className="text-right">
            <div className={`text-2xl font-bold transition-all duration-300 ${
              scoreRevealed ? "text-white" : "text-emerald-accent"
            }`}>
              {scoreRevealed ? `${match.teamGoals} - ${match.oppGoals}` : `${runningScore.team} - ${runningScore.opp}`}
            </div>
            {scoreRevealed && (
              <div className={`text-xs font-bold ${resultTextColors[match.result]} animate-fade-in`}>
                {resultLabels[match.result]}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="border-t border-gray-700 pt-3 space-y-1 max-h-64 overflow-y-auto"
      >
        {events.slice(0, revealedCount).map((event, i) => (
          <MatchEvent key={i} event={event} animate={i === revealedCount - 1} />
        ))}
        {!allEventsShown && (
          <div className="flex items-center gap-2 py-1">
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-1 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-1 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getEventDelay(event) {
  if (event.type === "goal" || event.type === "freekick" || event.type === "penalty") return 800;
  if (event.type === "red") return 700;
  if (event.type === "save") return 600;
  if (event.type === "yellow") return 500;
  if (event.type === "halftime" || event.type === "fulltime") return 600;
  return 400;
}

// ─── Static match card (expandable) ──
function MatchCard({ match }) {
  const [expanded, setExpanded] = useState(false);
  const resultColors = {
    W: "border-emerald-accent/50 bg-emerald-accent/5",
    D: "border-gold/50 bg-gold/5",
    L: "border-red-400/50 bg-red-400/5",
  };
  const resultLabels = { W: "WIN", D: "DRAW", L: "LOSS" };
  const resultTextColors = { W: "text-emerald-accent", D: "text-gold", L: "text-red-400" };

  return (
    <div
      className={`p-4 rounded-xl border ${resultColors[match.result]} transition-all duration-300 cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{match.round}</div>
          <div className="text-white font-medium">
            Your XI <span className="text-gray-400">vs</span> {match.opponent}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {match.teamGoals} - {match.oppGoals}
          </div>
          <div className={`text-xs font-bold ${resultTextColors[match.result]}`}>
            {resultLabels[match.result]}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
          {match.events.map((event, i) => (
            <MatchEvent key={i} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
