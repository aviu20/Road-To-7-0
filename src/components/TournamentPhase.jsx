import { useState, useEffect } from "react";
import { Swords, Trophy, XCircle } from "lucide-react";

export default function TournamentPhase({ results, onComplete }) {
  const [visibleMatches, setVisibleMatches] = useState(0);
  const [showingEvents, setShowingEvents] = useState(false);

  useEffect(() => {
    if (visibleMatches < results.length) {
      const timer = setTimeout(() => {
        setVisibleMatches((v) => v + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [visibleMatches, results.length, onComplete]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-10 h-10 text-gold mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-white">Tournament</h2>
          <p className="text-gray-400">Your legends take the field...</p>
        </div>

        <div className="space-y-3">
          {results.slice(0, visibleMatches).map((match, i) => (
            <MatchCard key={i} match={match} index={i} />
          ))}

          {visibleMatches < results.length && (
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Swords className="w-5 h-5 animate-pulse" />
                <span>Next match loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, index }) {
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
      className={`p-4 rounded-xl border ${resultColors[match.result]} transition-all duration-500 animate-slide-in cursor-pointer`}
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
            <div key={i} className={`text-xs ${event.team === "player" ? "text-emerald-accent" : "text-red-300"}`}>
              {event.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
