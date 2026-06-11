import { Star } from "lucide-react";
import { roleLabels, countryFlags } from "../data/legends";

function Flag({ country, size = "w-5" }) {
  const code = countryFlags[country];
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={country}
      className={`${size} h-auto rounded-[2px] shrink-0`}
    />
  );
}

const positionColors = {
  FW: "text-red-400 bg-red-400/10 border-red-400/30",
  MID: "text-emerald-accent bg-emerald-accent/10 border-emerald-accent/30",
  DEF: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  GK: "text-gold bg-gold/10 border-gold/30",
};

export default function PlayerCard({ player, onPick, compact = false }) {
  const isLegend = player.isMarqueeLegend;

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg border
        ${isLegend ? "bg-gold/5 border-gold/30" : "bg-surface-light border-gray-700"}`}>
        {isLegend && <Star className="w-3.5 h-3.5 text-gold fill-gold shrink-0" />}
        <div className={`px-2 py-0.5 rounded text-xs font-bold border ${positionColors[player.position]}`}>
          {player.role}
        </div>
        <div className="min-w-0">
          <span className={`font-medium text-sm ${isLegend ? "text-gold" : "text-white"}`}>{player.name}</span>
          <span className="text-gray-400 text-xs ml-2 inline-flex items-center gap-1">
            <Flag country={player.country} size="w-4" />
            {player.country} {player.year}
          </span>
        </div>
        <span className="ml-auto text-emerald-accent font-bold text-sm shrink-0">{player.rating}</span>
      </div>
    );
  }

  return (
    <div
      onClick={onPick}
      className={`group relative p-5 rounded-xl border cursor-pointer
                 transition-all duration-200 hover:scale-[1.02]
                 hover:shadow-lg
                 ${isLegend
                   ? "bg-gradient-to-b from-gold/8 to-surface border-gold/40 hover:border-gold hover:shadow-gold/15"
                   : "bg-surface border-gray-700 hover:border-emerald-accent hover:shadow-emerald-accent/10"
                 }`}
    >
      {/* Legend badge */}
      {isLegend && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold text-black text-[10px] font-bold uppercase tracking-wider">
          <Star className="w-3 h-3 fill-black" />
          Legend
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className={`px-2 py-0.5 rounded text-xs font-bold border ${positionColors[player.position]}`}>
          {roleLabels[player.role]}
        </div>
        <div className={`text-2xl font-bold ${isLegend ? "text-gold" : "text-emerald-accent"}`}>{player.rating}</div>
      </div>

      <h3 className={`text-lg font-bold mb-1 ${isLegend ? "text-gold" : "text-white"}`}>{player.name}</h3>
      <p className="text-sm text-gray-400 mb-3 flex items-center gap-1.5">
        <Flag country={player.country} />
        {player.country} • {player.year}
      </p>

      {/* Stats Bar */}
      <div className="space-y-2 mb-3">
        <StatBar label="ATK" value={player.stats.attack} color="bg-red-400" />
        <StatBar label="MID" value={player.stats.midfield} color="bg-emerald-400" />
        <StatBar label="DEF" value={player.stats.defense} color="bg-blue-400" />
      </div>

      {/* Superpower */}
      {player.superpower && (
        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-gold/10 border border-gold/20">
          <div className="text-[10px] uppercase tracking-wider text-gold/70 mb-0.5">Superpower</div>
          <div className="text-xs text-gold font-semibold">{player.superpower.name}</div>
          <div className="text-[10px] text-gold/60">{player.superpower.description}</div>
        </div>
      )}

      {/* Trivia — only show for 80+ rated players */}
      {player.rating >= 80 && (
        <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-700 pt-3">
          {player.trivia}
        </p>
      )}

      <div className={`absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
        ${isLegend ? "border-gold" : "border-emerald-accent"}`} />
    </div>
  );
}

function StatBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-8">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-6 text-right">{value}</span>
    </div>
  );
}
