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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Road to <span className="text-emerald-accent">7-0</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Draft legendary icons from every World Cup era. Build your dream XI.
          Can you go 7-0 and conquer the tournament?
        </p>
      </div>

      {/* Collection Badge */}
      {hasPlayed && (
        <div className="mb-6 p-4 rounded-xl bg-surface border border-gray-700 w-full max-w-lg">
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

      {/* Formation picker — always visible */}
      <div className="w-full max-w-lg">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3 text-center">
          Choose Your Formation
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {playingStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelected(style.id)}
              className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border
                         transition-all duration-200 cursor-pointer active:scale-[0.97]
                         ${selected === style.id
                           ? "border-emerald-accent bg-emerald-accent/10 ring-1 ring-emerald-accent/50"
                           : "border-gray-700 bg-surface hover:border-gray-500 hover:bg-surface-light"
                         }`}
            >
              {selected === style.id && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-accent flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={`p-2 rounded-lg transition-colors ${
                selected === style.id
                  ? "bg-emerald-accent/20 text-emerald-accent"
                  : "bg-gray-700/50 text-gray-400 group-hover:text-gray-300"
              }`}>
                {styleIcons[style.id]}
              </div>
              <div className="text-center">
                <div className={`text-sm font-bold ${selected === style.id ? "text-emerald-accent" : "text-white"}`}>
                  {style.name}
                </div>
                <div className="text-xs text-gray-500">{style.formation}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Description of selected formation */}
        {selected && (
          <p className="text-xs text-gray-400 text-center mb-6 animate-fade-in px-4">
            {playingStyles.find((s) => s.id === selected)?.description}
          </p>
        )}

        {/* Start button — only active when formation is chosen */}
        <button
          onClick={() => selected && onSelectStyle(selected)}
          disabled={!selected}
          className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl
                     font-bold text-lg transition-all duration-200 cursor-pointer active:scale-[0.98]
                     ${selected
                       ? "bg-emerald-accent text-white hover:bg-emerald-600"
                       : "bg-gray-700 text-gray-500 cursor-not-allowed"
                     }`}
        >
          <Swords className="w-5 h-5" />
          Start Drafting
        </button>
      </div>
    </div>
  );
}
