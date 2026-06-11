import { useState, useEffect, useRef } from "react";
import { Trophy, Play } from "lucide-react";

export default function TournamentPhase({ results, groupTable, onComplete }) {
  const [visibleMatches, setVisibleMatches] = useState(0);
  // Track which match is currently animating (null = none)
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
      // Start animating the next match
      setAnimatingMatch(visibleMatches);
    }
  };

  const handleAnimationComplete = () => {
    setVisibleMatches((v) => v + 1);
    setAnimatingMatch(null);
  };

  // Determine which match index is currently being animated
  const currentAnimIdx = animatingMatch;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-10 h-10 text-gold mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-white">Tournament</h2>
          <p className="text-gray-400">Your legends take the field...</p>
        </div>

        {/* Group Table */}
        {groupTable && visibleMatches > 0 && (
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
                {groupTable.map((team, i) => {
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
                      <td className="text-center py-2">{Math.min(team.played, visibleMatches > 0 ? 3 : 0)}</td>
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
              {/* Currently animating match (group stage) */}
              {currentAnimIdx !== null && currentAnimIdx < groupMatches.length && (
                <LiveMatchCard
                  key={`g-live-${currentAnimIdx}`}
                  match={groupMatches[currentAnimIdx]}
                  onComplete={handleAnimationComplete}
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
              {/* Currently animating match (knockout) */}
              {currentAnimIdx !== null && currentAnimIdx >= groupMatches.length && (
                <LiveMatchCard
                  key={`k-live-${currentAnimIdx}`}
                  match={knockoutMatches[currentAnimIdx - groupMatches.length]}
                  onComplete={handleAnimationComplete}
                />
              )}
            </div>
          </div>
        )}

        {/* Play Match / Continue Button */}
        <div className="flex justify-center mt-8">
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
    : event.team === "player"
      ? style.playerColor
      : style.oppColor;

  return (
    <div className={`text-xs ${colorClass} flex items-start gap-1.5 py-0.5 ${animClass}`}>
      <span className="shrink-0 w-4 text-center leading-4">{isNeutral ? "•" : ""}</span>
      <span className="leading-4">{event.text}</span>
    </div>
  );
}

// ─── Live match card: reveals events one-by-one, then shows final score ──
function LiveMatchCard({ match, onComplete }) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [scoreRevealed, setScoreRevealed] = useState(false);
  const containerRef = useRef(null);
  const events = match.events || [];
  const allEventsShown = revealedCount >= events.length;

  useEffect(() => {
    if (revealedCount < events.length) {
      const delay = getEventDelay(events[revealedCount]);
      const timer = setTimeout(() => {
        setRevealedCount((c) => c + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else if (!scoreRevealed) {
      // All events shown, reveal score after a beat
      const timer = setTimeout(() => setScoreRevealed(true), 600);
      return () => clearTimeout(timer);
    } else {
      // Score revealed, auto-complete after a moment
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, scoreRevealed, events.length, onComplete]);

  // Auto-scroll to bottom as events appear
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [revealedCount]);

  // Running score based on revealed events
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
      {/* Header with live score or final score */}
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

      {/* Events feed */}
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
  // Goals/penalties/freekicks get a longer pause for drama
  if (event.type === "goal" || event.type === "freekick" || event.type === "penalty") return 800;
  if (event.type === "red") return 700;
  if (event.type === "save") return 600;
  if (event.type === "yellow") return 500;
  if (event.type === "halftime" || event.type === "fulltime") return 600;
  // Info/color events are faster
  return 400;
}

// ─── Static match card (already completed, expandable) ──
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
