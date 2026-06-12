import { useState } from "react";
import { Swords, Shield, Target, Scale, BookOpen, Trophy, Check } from "lucide-react";
import { playingStyles } from "../data/legends";

const styleIcons = {
  attacking: <Swords className="w-6 h-6" />,
  defensive: <Shield className="w-6 h-6" />,
  tikitaka: <Target className="w-6 h-6" />,
  balanced: <Scale className="w-6 h-6" />,
};

export default function SetupPhase({ onSelectStyle, collectionStats }) {
  const hasPlayed = collectionStats && collectionStats.runs > 0;
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
      {/* Title block */}
      <div className="text-center mb-10 animate-slide-up">
        <h1 className="font-display text-5xl md:text-7xl text-white mb-1 tracking-tight uppercase">
          <span className="text-emerald-accent">2026</span> World Cup
        </h1>
        <div className="w-16 h-0.5 bg-emerald-accent/60 mx-auto my-4 rounded-full" />
        <p className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed">
          Draft legends from every era. Build your dream XI.
          Win the World Cup.
        </p>
      </div>

      {/* Collection Badge */}
      {hasPlayed && (
        <div className="mb-6 p-4 rounded-xl bg-surface/80 border border-gray-700/60 w-full max-w-lg backdrop-blur-sm animate-fade-in surface-noise">
          <div className="flex items-center gap-3 relative z-10">
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
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-gray-500">
                  {collectionStats.percentage}% discovered
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {collectionStats.wins}/{collectionStats.runs} runs won
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formation picker */}
      <div className="w-full max-w-lg" style={{ animationDelay: '0.15s' }}>
        <h3 className="font-display text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 text-center">
          Choose Your Formation
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {playingStyles.map((style, i) => (
            <button
              key={style.id}
              onClick={() => setSelected(style.id)}
              className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border
                         transition-all duration-200 cursor-pointer active:scale-[0.97] surface-noise
                         animate-card-enter
                         ${selected === style.id
                           ? "border-emerald-accent bg-emerald-accent/10 ring-1 ring-emerald-accent/40"
                           : "border-gray-700/60 bg-surface/70 hover:border-gray-500 hover:bg-surface-light/70"
                         }`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {selected === style.id && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-accent flex items-center justify-center shadow-lg shadow-emerald-accent/30">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={`relative z-10 p-2 rounded-lg transition-colors ${
                selected === style.id
                  ? "bg-emerald-accent/20 text-emerald-accent"
                  : "bg-gray-700/50 text-gray-400 group-hover:text-gray-300"
              }`}>
                {styleIcons[style.id]}
              </div>
              <div className="text-center relative z-10">
                <div className={`font-display text-sm uppercase tracking-wide ${selected === style.id ? "text-emerald-accent" : "text-white"}`}>
                  {style.name}
                </div>
                <div className="text-xs text-gray-500 font-mono">{style.formation}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Description of selected formation */}
        {selected && (
          <p className="text-xs text-gray-400 text-center mb-6 animate-fade-in px-4 leading-relaxed">
            {playingStyles.find((s) => s.id === selected)?.description}
          </p>
        )}

        {/* Start button */}
        <button
          onClick={() => selected && onSelectStyle(selected)}
          disabled={!selected}
          className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl
                     font-display text-lg uppercase tracking-wide transition-all duration-200 cursor-pointer active:scale-[0.98]
                     ${selected
                       ? "bg-emerald-accent text-white hover:bg-emerald-600 shadow-lg shadow-emerald-accent/20"
                       : "bg-gray-800 text-gray-500 cursor-not-allowed"
                     }`}
        >
          <Swords className="w-5 h-5" />
          Start Drafting
        </button>
      </div>
    </div>
  );
}
