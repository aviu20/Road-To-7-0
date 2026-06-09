import { useState } from "react";
import { Trophy, Star, RotateCcw, Award, BookOpen, Share2, Check } from "lucide-react";
import { calculateTeamStats, checkRecordBreakers } from "../engine/gameEngine";
import { countryFlags } from "../data/legends";
import PlayerCard from "./PlayerCard";

function buildShareText(squad, results, eliminated, wonTournament, totalGoals, wins) {
  const legends = squad.filter((p) => p.isMarqueeLegend);
  const topNames = legends.slice(0, 3).map((p) => p.name);
  const nameStr = topNames.length > 0 ? topNames.join(", ") : squad.slice(0, 3).map((p) => p.name).join(", ");

  const resultLine = wonTournament
    ? `I went ${wins}-0 and won the World Cup!`
    : `Eliminated in the ${results[results.length - 1].round}`;

  const lines = [
    `⚽ Road to 7-0 — World Cup Draft`,
    ``,
    resultLine,
    `${totalGoals} goals in ${results.length} matches`,
    ``,
    `My squad: ${nameStr}${legends.length > 3 ? ` +${legends.length - 3} more legends` : ""}`,
    ``,
    `Draft your dream XI → road-to-7-0.vercel.app`,
  ];
  return lines.join("\n");
}

export default function GameOverPhase({ squad, results, eliminated, finalRound, onRestart, collectionStats }) {
  const [copied, setCopied] = useState(false);
  const teamStats = calculateTeamStats(squad);
  const records = checkRecordBreakers(squad, results);
  const totalGoals = results.reduce((sum, r) => sum + r.teamGoals, 0);
  const cleanSheets = results.filter((r) => r.cleanSheet).length;
  const wins = results.filter((r) => r.result === "W").length;
  const wonTournament = !eliminated && results.length === 7;

  const handleShare = async () => {
    const text = buildShareText(squad, results, eliminated, wonTournament, totalGoals, wins);
    if (navigator.share) {
      try {
        await navigator.share({ title: "Road to 7-0", text, url: "https://road-to-7-0.vercel.app" });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Team Ratings (Position-Weighted)</h3>
          <div className="grid grid-cols-3 gap-4">
            <RatingCircle label="Attack" value={teamStats.attack} color="text-red-400" />
            <RatingCircle label="Midfield" value={teamStats.midfield} color="text-emerald-accent" />
            <RatingCircle label="Defense" value={teamStats.defense} color="text-blue-400" />
          </div>
        </div>

        {/* Record Breakers — Premium Card Design */}
        {records.length > 0 && (
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gold mb-4">
              <Award className="w-5 h-5" />
              Record Breaker Cards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {records.map((record, i) => (
                <RecordBreakerCard key={i} record={record} />
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

        {/* Collection Progress */}
        {collectionStats && (
          <div className="mb-8 p-4 rounded-xl bg-surface border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <BookOpen className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">Collection</span>
                  <span className="text-sm text-gold font-bold">
                    {collectionStats.collected}/{collectionStats.total}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold transition-all"
                    style={{ width: `${collectionStats.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {collectionStats.percentage}% of all players discovered — draft again to find more!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pb-8">
          <button
            onClick={handleShare}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer
                       ${copied
                         ? "bg-emerald-accent/20 text-emerald-accent border border-emerald-accent/40"
                         : "bg-surface text-white border border-gray-600 hover:border-gray-400"
                       }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copied!" : "Share Result"}
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-accent text-white font-semibold
                       hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Draft Again
          </button>
        </div>
      </div>
    </div>
  );
}

function RecordBreakerCard({ record }) {
  const { player, headline } = record;
  return (
    <div className="relative overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-br from-gold/15 via-surface to-gold/5 p-5">
      {/* Shimmer accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gold/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gold/8 blur-xl" />

      <div className="relative">
        {/* Top badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/20 border border-gold/30">
            <Trophy className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Record Breaker</span>
          </div>
        </div>

        {/* Player info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
            <span className="text-xl font-black text-gold">{player.rating}</span>
          </div>
          <div>
            <h4 className="text-white font-bold text-base">{player.name}</h4>
            <p className="text-gold/60 text-xs flex items-center gap-1">
              <img src={`https://flagcdn.com/w40/${countryFlags[player.country]}.png`} alt="" className="w-4 h-auto rounded-[1px]" />
              {player.country} • {player.year}
            </p>
          </div>
        </div>

        {/* Headline */}
        <p className="text-gold font-medium text-sm leading-relaxed">{headline}</p>

        {/* Superpower tag */}
        {player.superpower && (
          <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold/10 border border-gold/20">
            <Star className="w-3 h-3 text-gold fill-gold" />
            <span className="text-[10px] text-gold/80 font-semibold">{player.superpower.name}</span>
          </div>
        )}
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
