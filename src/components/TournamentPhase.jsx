import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy, Play, FastForward } from "lucide-react";

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

const KNOCKOUT_ROUNDS = ["Round of 16", "Quarter-Final", "Semi-Final", "Final"];

export default function TournamentPhase({ results, groupTable, onComplete }) {
  const [visibleMatches, setVisibleMatches] = useState(0);
  const [animatingMatch, setAnimatingMatch] = useState(null);
  const [showBracket, setShowBracket] = useState(false);
  const [bracketDone, setBracketDone] = useState(false);

  const groupMatches = results.filter((r) => r.round.startsWith("Group"));
  const knockoutMatches = results.filter((r) => !r.round.startsWith("Group"));
  const isGroupDone = visibleMatches >= groupMatches.length;
  const knockoutVisible = Math.max(0, visibleMatches - groupMatches.length);
  const allRevealed = visibleMatches >= results.length;

  const justFinishedGroup = isGroupDone && knockoutVisible === 0 && !showBracket && !bracketDone && animatingMatch === null;

  const handlePlayMatch = () => {
    if (allRevealed) {
      onComplete();
    } else if (justFinishedGroup && !bracketDone) {
      setShowBracket(true);
    } else if (animatingMatch === null) {
      setAnimatingMatch(visibleMatches);
    }
  };

  const handleBracketComplete = useCallback(() => {
    setShowBracket(false);
    setBracketDone(true);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setVisibleMatches((v) => v + 1);
    setAnimatingMatch(null);
  }, []);

  const handleSkip = useCallback(() => {
    setVisibleMatches((v) => v + 1);
    setAnimatingMatch(null);
  }, []);

  const currentAnimIdx = animatingMatch;

  const progressiveTable = groupTable ? groupTable.map((team) => {
    if (!team.isUser) return team;
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

  const nextMatchIdx = animatingMatch !== null ? animatingMatch : visibleMatches;
  const nextMatch = results[nextMatchIdx];

  const userQualified = progressiveTable
    ? progressiveTable.findIndex((t) => t.isUser) < 2
    : false;

  return (
    <div className="min-h-screen px-4 py-6 pb-32 relative z-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
          <h2 className="font-display text-3xl text-white uppercase tracking-tight">Tournament</h2>
        </div>

        {/* Group Table — persistent during group stage */}
        {progressiveTable && !isGroupDone && (
          <GroupTable table={progressiveTable} isGroupDone={false} />
        )}
        {progressiveTable && isGroupDone && !bracketDone && !showBracket && (
          <GroupTable table={progressiveTable} isGroupDone={true} qualified={userQualified} />
        )}

        {/* Bracket Animation */}
        {showBracket && (
          <KnockoutBracket knockoutMatches={knockoutMatches} onComplete={handleBracketComplete} />
        )}

        {/* Group Matches */}
        {groupMatches.length > 0 && (visibleMatches > 0 || currentAnimIdx !== null) && !showBracket && (
          <div className="mb-4">
            <h3 className="font-display text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">Group Stage</h3>
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
        {bracketDone && (knockoutVisible > 0 || (currentAnimIdx !== null && currentAnimIdx >= groupMatches.length)) && (
          <div className="mb-4">
            <h3 className="font-display text-xs uppercase tracking-[0.15em] text-gray-500 mb-2 mt-4">Knockout Rounds</h3>
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
        {visibleMatches > 0 && animatingMatch === null && !allRevealed && !showBracket && (
          <div className="text-center my-4 animate-fade-in">
            <p className="text-sm text-gray-400 italic">{getPostMatchLine(results[visibleMatches - 1])}</p>
          </div>
        )}

        {/* Pre-match narrative */}
        {!allRevealed && animatingMatch === null && nextMatch && !showBracket && !justFinishedGroup && bracketDone && (
          <div className="text-center mt-2 mb-4">
            <p className="text-xs text-gray-500">
              Next: <span className="text-white font-medium">Your XI vs {nextMatch.opponent}</span>
              {" · "}{preMatchLines[nextMatch.round] || ""}
            </p>
          </div>
        )}

        {/* Play Match Button — fixed bottom */}
        {!showBracket && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#060a13] via-[#060a13]/95 to-transparent z-30">
            <div className="max-w-2xl mx-auto flex justify-center">
              <button
                onClick={handlePlayMatch}
                disabled={animatingMatch !== null}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-display uppercase tracking-wide transition-all cursor-pointer text-base
                           ${animatingMatch !== null
                             ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                             : "bg-emerald-accent text-white hover:bg-emerald-600 active:scale-95 shadow-lg shadow-emerald-accent/25"
                           }`}
              >
                {allRevealed ? (
                  <><Trophy className="w-5 h-5" />See Results</>
                ) : justFinishedGroup ? (
                  <><Play className="w-5 h-5" />Enter Knockouts</>
                ) : (
                  <><Play className="w-5 h-5" />{visibleMatches === 0 && animatingMatch === null ? "Play Match 1" : "Play Next Match"}</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Group Table ──────────────────────────
function GroupTable({ table, isGroupDone, qualified }) {
  return (
    <div className="mb-4 p-3 rounded-xl bg-surface/80 border border-gray-700/60 backdrop-blur-sm surface-noise">
      <h3 className="font-display text-xs uppercase tracking-[0.15em] text-gray-400 mb-2 relative z-10">Group Standings</h3>
      <div className="overflow-x-auto -mx-1 relative z-10">
        <table className="w-full text-xs min-w-[320px]">
          <thead>
            <tr className="text-gray-500 uppercase font-display tracking-wider">
              <th className="text-left pb-1.5 pl-1 w-5">#</th>
              <th className="text-left pb-1.5">Team</th>
              <th className="text-center pb-1.5 w-7">P</th>
              <th className="text-center pb-1.5 w-7">W</th>
              <th className="text-center pb-1.5 w-7">D</th>
              <th className="text-center pb-1.5 w-7">L</th>
              <th className="text-center pb-1.5 w-8">GD</th>
              <th className="text-center pb-1.5 w-8 font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((team, i) => {
              const gd = team.goalsFor - team.goalsAgainst;
              const isQualified = i < 2 && isGroupDone;
              return (
                <tr
                  key={team.name}
                  className={`border-t border-gray-700/40 ${
                    team.isUser ? "text-emerald-accent font-semibold" : "text-gray-300"
                  } ${isQualified ? "bg-emerald-accent/5" : i >= 2 && isGroupDone ? "opacity-40" : ""}`}
                >
                  <td className="py-1.5 pl-1 text-gray-500">{i + 1}</td>
                  <td className="py-1.5 truncate max-w-[120px]">{team.isUser ? "Your XI" : team.name}</td>
                  <td className="text-center py-1.5">{team.played}</td>
                  <td className="text-center py-1.5">{team.wins}</td>
                  <td className="text-center py-1.5">{team.draws}</td>
                  <td className="text-center py-1.5">{team.losses}</td>
                  <td className="text-center py-1.5">{gd > 0 ? `+${gd}` : gd}</td>
                  <td className="text-center py-1.5 font-bold">{team.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isGroupDone && (
        <div className={`mt-2 text-xs relative z-10 ${qualified ? "text-emerald-accent" : "text-red-400"}`}>
          {qualified ? "✓ Your XI qualified for the knockout rounds!" : "✗ Your XI did not qualify."}
        </div>
      )}
    </div>
  );
}

// ─── Knockout Bracket ──────────────────────
function KnockoutBracket({ knockoutMatches, onComplete }) {
  const [activeRound, setActiveRound] = useState(0);
  const maxRound = knockoutMatches.length;

  useEffect(() => {
    if (activeRound < maxRound) {
      const timer = setTimeout(() => setActiveRound((r) => r + 1), 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [activeRound, maxRound, onComplete]);

  return (
    <div className="mb-6 p-5 rounded-xl bg-surface/80 border border-gray-700/60 overflow-hidden backdrop-blur-sm surface-noise">
      <h3 className="font-display text-xs uppercase tracking-[0.2em] text-gray-400 mb-5 text-center relative z-10">The Road Ahead</h3>
      <div className="flex items-center justify-center gap-1 sm:gap-2 relative z-10">
        {KNOCKOUT_ROUNDS.slice(0, maxRound).map((round, i) => {
          const isReached = i < activeRound;
          const isCurrent = i === activeRound;
          const match = knockoutMatches[i];
          const isLast = i === maxRound - 1;
          return (
            <div key={round} className="flex items-center gap-1 sm:gap-2">
              <div className={`flex flex-col items-center transition-all duration-500 ${
                isReached ? "opacity-100 scale-100" : isCurrent ? "opacity-100 scale-105" : "opacity-25 scale-95"
              }`}>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-500 ${
                  isReached
                    ? "border-emerald-accent bg-emerald-accent/15 text-emerald-accent"
                    : isCurrent
                    ? "border-gold bg-gold/10 text-gold animate-pulse"
                    : "border-gray-600 bg-surface-light/50 text-gray-500"
                }`}>
                  <span className="text-lg">{round === "Final" ? "🏆" : "⚽"}</span>
                  <span className="font-display text-[9px] uppercase leading-tight text-center px-1">
                    {round === "Round of 16" ? "R16" : round === "Quarter-Final" ? "QF" : round === "Semi-Final" ? "SF" : "Final"}
                  </span>
                </div>
                <div className={`text-[10px] mt-1 text-center max-w-16 sm:max-w-20 truncate transition-all duration-500 ${
                  isReached ? "text-gray-300" : "text-gray-600"
                }`}>
                  {match ? `vs ${match.opponent}` : ""}
                </div>
              </div>
              {!isLast && (
                <div className={`w-4 sm:w-8 h-0.5 rounded transition-all duration-700 ${
                  isReached ? "bg-emerald-accent" : "bg-gray-700/50"
                }`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center relative z-10">
        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full transition-all duration-500 ${
          activeRound >= maxRound ? "bg-emerald-accent/20 text-emerald-accent" : "bg-gold/20 text-gold animate-pulse"
        }`}>
          {activeRound >= maxRound ? "Let's go!" : "Your XI enters the knockout stage..."}
        </span>
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
      <div className={`text-xs text-center py-1.5 my-1 border-y border-gray-700/40 ${
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
      <span className="shrink-0 w-4 text-center leading-4">{isNeutral ? "·" : ""}</span>
      <span className="leading-4">{event.text}</span>
    </div>
  );
}

// ─── Live match card ──
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
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
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
    W: "border-emerald-accent/40 bg-emerald-accent/5",
    D: "border-gold/40 bg-gold/5",
    L: "border-red-400/40 bg-red-400/5",
  };
  const resultLabels = { W: "WIN", D: "DRAW", L: "LOSS" };
  const resultTextColors = { W: "text-emerald-accent", D: "text-gold", L: "text-red-400" };

  return (
    <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-500 surface-noise ${
      scoreRevealed ? resultColors[match.result] : "border-emerald-accent/30 bg-emerald-accent/5"
    } ${!scoreRevealed ? "animate-glow-pulse" : ""}`}>
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <span className="truncate font-display tracking-[0.1em]">{match.round}</span>
            {!scoreRevealed && (
              <span className="inline-flex items-center gap-1 text-emerald-accent shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse" />
                <span className="font-display text-[10px] tracking-wider">LIVE</span>
              </span>
            )}
          </div>
          <div className="text-white font-medium text-sm sm:text-base truncate">
            Your XI <span className="text-gray-500">vs</span> {match.opponent}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-3">
          {!scoreRevealed && (
            <button
              onClick={(e) => { e.stopPropagation(); onSkip(); }}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 hover:text-gray-300
                         hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <FastForward className="w-3 h-3" />
              <span className="hidden sm:inline">Skip</span>
            </button>
          )}
          <div className="text-right">
            <div className={`font-display text-2xl sm:text-3xl transition-all duration-300 ${
              scoreRevealed ? "text-white animate-score-pop" : "text-emerald-accent"
            }`}>
              {scoreRevealed ? `${match.teamGoals}–${match.oppGoals}` : `${runningScore.team}–${runningScore.opp}`}
            </div>
            {scoreRevealed && (
              <div className={`font-display text-xs tracking-wider ${resultTextColors[match.result]} animate-fade-in`}>
                {resultLabels[match.result]}
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={containerRef} className="border-t border-gray-700/40 pt-2 space-y-1 max-h-48 sm:max-h-64 overflow-y-auto relative z-10">
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

// ─── Static match card ──
function MatchCard({ match }) {
  const [expanded, setExpanded] = useState(false);
  const resultColors = {
    W: "border-emerald-accent/40 bg-emerald-accent/5",
    D: "border-gold/40 bg-gold/5",
    L: "border-red-400/40 bg-red-400/5",
  };
  const resultLabels = { W: "WIN", D: "DRAW", L: "LOSS" };
  const resultTextColors = { W: "text-emerald-accent", D: "text-gold", L: "text-red-400" };

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl border ${resultColors[match.result]} transition-all duration-300 cursor-pointer surface-noise`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-display tracking-[0.1em]">{match.round}</div>
          <div className="text-white font-medium text-sm sm:text-base truncate">
            Your XI <span className="text-gray-500">vs</span> {match.opponent}
          </div>
        </div>
        <div className="text-right shrink-0 ml-3">
          <div className="font-display text-2xl sm:text-3xl text-white">
            {match.teamGoals}–{match.oppGoals}
          </div>
          <div className={`font-display text-xs tracking-wider ${resultTextColors[match.result]}`}>
            {resultLabels[match.result]}
          </div>
        </div>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700/40 space-y-1 relative z-10">
          {match.events.map((event, i) => (
            <MatchEvent key={i} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
