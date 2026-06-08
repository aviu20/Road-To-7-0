import { Trophy, Star, RotateCcw, Award } from "lucide-react";
import { calculateTeamStats, checkRecordBreakers } from "../engine/gameEngine";
import PlayerCard from "./PlayerCard";

export default function GameOverPhase({ squad, results, eliminated, finalRound, onRestart }) {
  const teamStats = calculateTeamStats(squad);
  const records = checkRecordBreakers(squad, results);
  const totalGoals = results.reduce((sum, r) => sum + r.teamGoals, 0);
  const cleanSheets = results.filter((r) => r.cleanSheet).length;
  const wins = results.filter((r) => r.result === "W").length;
  const wonTournament = !eliminated && results.length === 7;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {wonTournament ? (
            <>
              <Trophy className="w-16 h-16 text-gold mx-auto mb-4 animate-bounce" />
              <h1 className="text-4xl font-bold text-gold mb-2">World Champions!</h1>
              <p className="text-gray-400">Your legends conquered the tournament!</p>
            </>
          ) : (
            <>
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Tournament Over</h1>
              <p className="text-gray-400">Eliminated in the {finalRound}</p>
            </>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatBox label="Matches" value={results.length} />
          <StatBox label="Wins" value={wins} />
          <StatBox label="Goals" value={totalGoals} />
          <StatBox label="Clean Sheets" value={cleanSheets} />
        </div>

        {/* Team Rating */}
        <div className="p-5 rounded-xl bg-surface border border-gray-700 mb-8">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Team Ratings</h3>
          <div className="grid grid-cols-3 gap-4">
            <RatingCircle label="Attack" value={teamStats.attack} color="text-red-400" />
            <RatingCircle label="Midfield" value={teamStats.midfield} color="text-emerald-accent" />
            <RatingCircle label="Defense" value={teamStats.defense} color="text-blue-400" />
          </div>
        </div>

        {/* Record Breakers */}
        {records.length > 0 && (
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gold mb-4">
              <Award className="w-5 h-5" />
              Record Breaker Cards
            </h3>
            <div className="space-y-3">
              {records.map((record, i) => (
                <div key={i} className="p-4 rounded-xl bg-gradient-to-r from-gold/10 to-transparent border border-gold/30">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <div className="text-gold font-bold text-sm">{record.headline}</div>
                      <div className="text-gray-400 text-xs mt-0.5">Inspired by {record.player.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Squad */}
        <div className="mb-8">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Your Squad</h3>
          <div className="space-y-2">
            {squad.map((player) => (
              <PlayerCard key={player.id} player={player} compact />
            ))}
          </div>
        </div>

        {/* Restart */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-accent text-white font-semibold
                       hover:bg-emerald-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Draft Again
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-surface border border-gray-700 text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function RatingCircle({ label, value, color }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}
