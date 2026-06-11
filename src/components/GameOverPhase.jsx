import { useState } from "react";
import { Trophy, Star, RotateCcw, BookOpen, Share2, Check } from "lucide-react";
import { computeTournamentStats } from "../engine/gameEngine";
import PlayerCard from "./PlayerCard";

// ── Real World Cup tournament records to compare against ──
const TOURNAMENT_RECORDS = [
  {
    id: "top_scorer",
    label: "Golden Boot",
    icon: "👟",
    record: { holder: "Just Fontaine", value: 13, tournament: "1958", country: "France" },
    getStat: (stats) => stats.scorers[0]?.count || 0,
    getPlayer: (stats) => stats.scorers[0],
    unit: "goals",
  },
  {
    id: "team_goals",
    label: "Team Goals (Tournament)",
    icon: "⚽",
    record: { holder: "Hungary", value: 27, tournament: "1954", country: "Hungary" },
    getTeamStat: (results) => results.reduce((s, r) => s + r.teamGoals, 0),
    unit: "goals",
  },
  {
    id: "clean_sheets",
    label: "Clean Sheets",
    icon: "🧤",
    record: { holder: "Fabien Barthez", value: 5, tournament: "1998/2006", country: "France" },
    getTeamStat: (results) => results.filter((r) => r.cleanSheet).length,
    unit: "clean sheets",
  },
  {
    id: "most_assists",
    label: "Most Assists",
    icon: "🎯",
    record: { holder: "Diego Maradona", value: 8, tournament: "1986/1990", country: "Argentina" },
    getStat: (stats) => stats.assisters[0]?.count || 0,
    getPlayer: (stats) => stats.assisters[0],
    unit: "assists",
  },
  {
    id: "most_saves",
    label: "Most Saves",
    icon: "🥅",
    record: { holder: "Tim Howard", value: 16, tournament: "2014", country: "USA" },
    getStat: (stats) => stats.saves[0]?.count || 0,
    getPlayer: (stats) => stats.saves[0],
    unit: "saves",
  },
  {
    id: "goals_per_match",
    label: "Goals Per Match",
    icon: "📊",
    record: { holder: "Sándor Kocsis", value: 2.2, tournament: "1954", country: "Hungary" },
    getCustom: (stats, results) => {
      const top = stats.scorers[0];
      if (!top) return null;
      return { value: +(top.count / results.length).toFixed(1), player: top };
    },
    unit: "per match",
  },
];

function buildShareText(squad, results, eliminated, wonTournament, totalGoals, wins, tourneyStats) {
  const legends = squad.filter((p) => p.isMarqueeLegend);
  const topNames = legends.slice(0, 3).map((p) => p.name);
  const nameStr = topNames.length > 0 ? topNames.join(", ") : squad.slice(0, 3).map((p) => p.name).join(", ");

  const resultLine = wonTournament
    ? `I went ${wins}-0 and won the World Cup!`
    : `Eliminated in the ${results[results.length - 1].round}`;

  const topScorer = tourneyStats?.scorers?.[0];
  const scorerLine = topScorer ? `⭐ ${topScorer.name}: ${topScorer.count} goals` : "";

  const lines = [
    `⚽ Road to 7-0 — World Cup Draft`,
    ``,
    resultLine,
    `${totalGoals} goals in ${results.length} matches`,
    ...(scorerLine ? [scorerLine] : []),
    ``,
    `My squad: ${nameStr}${legends.length > 3 ? ` +${legends.length - 3} more legends` : ""}`,
    ``,
    `Draft your dream XI → road-to-7-0.vercel.app`,
  ];
  return lines.join("\n");
}

export default function GameOverPhase({ squad, results, eliminated, finalRound, onRestart, collectionStats }) {
  const [copied, setCopied] = useState(false);
  const tourneyStats = computeTournamentStats(results);
  const totalGoals = results.reduce((sum, r) => sum + r.teamGoals, 0);
  const cleanSheets = results.filter((r) => r.cleanSheet).length;
  const wins = results.filter((r) => r.result === "W").length;
  const wonTournament = !eliminated && results.length === 7;

  // Build record comparisons
  const recordComparisons = TOURNAMENT_RECORDS.map((rec) => {
    let yourValue = 0;
    let yourPlayer = null;

    if (rec.getCustom) {
      const custom = rec.getCustom(tourneyStats, results);
      if (!custom) return null;
      yourValue = custom.value;
      yourPlayer = custom.player;
    } else if (rec.getTeamStat) {
      yourValue = rec.getTeamStat(results);
    } else {
      yourValue = rec.getStat(tourneyStats);
      yourPlayer = rec.getPlayer(tourneyStats);
    }

    if (yourValue === 0) return null;

    const pct = Math.min(100, Math.round((yourValue / rec.record.value) * 100));
    const broken = yourValue >= rec.record.value;

    return { ...rec, yourValue, yourPlayer, pct, broken };
  }).filter(Boolean);

  const handleShare = async () => {
    const text = buildShareText(squad, results, eliminated, wonTournament, totalGoals, wins, tourneyStats);
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

        {/* Tournament Player Stats */}
        {(tourneyStats.scorers.length > 0 || tourneyStats.saves.length > 0) && (
          <div className="mb-8 p-5 rounded-xl bg-surface border border-gray-700">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Player Awards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Scorers */}
              {tourneyStats.scorers.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">⚽</span>
                    <span className="text-xs font-semibold text-emerald-accent uppercase tracking-wider">Top Scorers</span>
                  </div>
                  <div className="space-y-1">
                    {tourneyStats.scorers.slice(0, 5).map((s, i) => (
                      <div key={s.id} className="flex items-center justify-between text-xs">
                        <span className={i === 0 ? "text-white font-semibold" : "text-gray-300"}>
                          {i === 0 && "🥇 "}{i === 1 && "🥈 "}{i === 2 && "🥉 "}{s.name}
                        </span>
                        <span className="text-emerald-accent font-bold">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Assists */}
              {tourneyStats.assisters.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">👟</span>
                    <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Most Assists</span>
                  </div>
                  <div className="space-y-1">
                    {tourneyStats.assisters.slice(0, 5).map((a, i) => (
                      <div key={a.id} className="flex items-center justify-between text-xs">
                        <span className={i === 0 ? "text-white font-semibold" : "text-gray-300"}>
                          {i === 0 && "🥇 "}{i === 1 && "🥈 "}{i === 2 && "🥉 "}{a.name}
                        </span>
                        <span className="text-blue-300 font-bold">{a.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GK Saves */}
              {tourneyStats.saves.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">🧤</span>
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Saves</span>
                  </div>
                  <div className="space-y-1">
                    {tourneyStats.saves.slice(0, 3).map((s, i) => (
                      <div key={s.id} className="flex items-center justify-between text-xs">
                        <span className={i === 0 ? "text-white font-semibold" : "text-gray-300"}>{s.name}</span>
                        <span className="text-blue-400 font-bold">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards */}
              {(tourneyStats.yellowCards.length > 0 || tourneyStats.redCards.length > 0) && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">🟨</span>
                    <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">Discipline</span>
                  </div>
                  <div className="space-y-1">
                    {tourneyStats.yellowCards.slice(0, 3).map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{c.name}</span>
                        <span className="text-yellow-300 font-bold">{c.count} 🟨</span>
                      </div>
                    ))}
                    {tourneyStats.redCards.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{c.name}</span>
                        <span className="text-red-400 font-bold">{c.count} 🟥</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Records vs Real World Cup History */}
        {recordComparisons.length > 0 && (
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gold mb-4">
              <Trophy className="w-5 h-5" />
              vs World Cup Records
            </h3>
            <div className="space-y-3">
              {recordComparisons.map((rec) => (
                <RecordComparison key={rec.id} rec={rec} />
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

function RecordComparison({ rec }) {
  const { icon, label, record, yourValue, yourPlayer, pct, broken, unit } = rec;

  return (
    <div className={`p-4 rounded-xl border ${
      broken
        ? "border-gold/50 bg-gradient-to-r from-gold/10 to-gold/5"
        : "border-gray-700 bg-surface"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-semibold text-white">{label}</span>
          {broken && (
            <span className="px-2 py-0.5 rounded-full bg-gold/20 border border-gold/30 text-[10px] font-bold text-gold uppercase tracking-wider">
              Record Broken!
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-2 rounded-full bg-gray-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              broken ? "bg-gradient-to-r from-gold to-yellow-300" : "bg-emerald-accent"
            }`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <span className={`text-sm font-bold ${broken ? "text-gold" : "text-emerald-accent"}`}>
          {pct}%
        </span>
      </div>

      {/* Comparison */}
      <div className="flex items-center justify-between text-xs">
        <div className="text-gray-400">
          <span className={broken ? "text-gold font-semibold" : "text-white font-semibold"}>
            {yourPlayer ? yourPlayer.name : "Your XI"}: {yourValue} {yourValue === 1 && unit.endsWith("s") ? unit.slice(0, -1) : unit}
          </span>
        </div>
        <div className="text-gray-500">
          Record: {record.holder} ({record.value}, {record.tournament})
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
