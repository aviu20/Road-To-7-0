import { useState } from "react";
import { Swords, Trophy, Play } from "lucide-react";

export default function TournamentPhase({ results, groupTable, onComplete }) {
  const [visibleMatches, setVisibleMatches] = useState(0);

  const groupMatches = results.filter((r) => r.round.startsWith("Group"));
  const knockoutMatches = results.filter((r) => !r.round.startsWith("Group"));
  const isGroupDone = visibleMatches >= groupMatches.length;
  const knockoutVisible = Math.max(0, visibleMatches - groupMatches.length);
  const allRevealed = visibleMatches >= results.length;

  const handlePlayMatch = () => {
    if (allRevealed) {
      onComplete();
    } else {
      setVisibleMatches((v) => v + 1);
    }
  };

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
        {groupMatches.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Group Stage</h3>
            <div className="space-y-3">
              {groupMatches.slice(0, visibleMatches).map((match, i) => (
                <MatchCard key={`g${i}`} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* Knockout Matches */}
        {isGroupDone && knockoutVisible > 0 && (
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 mt-6">Knockout Rounds</h3>
            <div className="space-y-3">
              {knockoutMatches.slice(0, knockoutVisible).map((match, i) => (
                <MatchCard key={`k${i}`} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* Play Match / Continue Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handlePlayMatch}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer
                       bg-emerald-accent text-white hover:bg-emerald-600 active:scale-95"
          >
            {allRevealed ? (
              <>
                <Trophy className="w-5 h-5" />
                See Results
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {visibleMatches === 0 ? "Start Tournament" : "Play Next Match"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

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
            <div key={i} className={`text-xs ${
              event.team === "player" ? "text-emerald-accent" :
              event.team === "opponent" ? "text-red-300" :
              "text-gray-400"
            }`}>
              {event.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
