import { Swords, Shield, Target, Scale, BookOpen, Trophy } from "lucide-react";
import { playingStyles } from "../data/legends";

const styleIcons = {
  attacking: <Swords className="w-6 h-6" />,
  defensive: <Shield className="w-6 h-6" />,
  tikitaka: <Target className="w-6 h-6" />,
  balanced: <Scale className="w-6 h-6" />,
};

export default function SetupPhase({ onSelectStyle, collectionStats }) {
  const hasPlayed = collectionStats && collectionStats.runs > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12">
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
        <div className="mb-8 p-4 rounded-xl bg-surface border border-gray-700 w-full max-w-lg">
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

      <div className="w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-200 text-center mb-6">
          Choose Your Playing Style
        </h2>

        {playingStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style.id)}
            className="w-full group flex items-center gap-4 p-5 rounded-xl bg-surface border border-gray-700
                       hover:border-emerald-accent hover:bg-surface-light transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 rounded-lg bg-emerald-accent/10 text-emerald-accent group-hover:bg-emerald-accent/20 transition-colors">
              {styleIcons[style.id]}
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-white">{style.name}</div>
              <div className="text-xs text-emerald-accent/70 font-medium mb-1">Formation: {style.formation}</div>
              <div className="text-sm text-gray-400">{style.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
