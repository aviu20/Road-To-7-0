import { Swords, Shield, Target, Scale } from "lucide-react";
import { playingStyles } from "../data/legends";

const styleIcons = {
  attacking: <Swords className="w-6 h-6" />,
  defensive: <Shield className="w-6 h-6" />,
  tikitaka: <Target className="w-6 h-6" />,
  balanced: <Scale className="w-6 h-6" />,
};

export default function SetupPhase({ onSelectStyle }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          World Cup <span className="text-emerald-accent">Draft</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Draft legendary icons from World Cup history. Build your dream squad.
          Can you conquer the tournament?
        </p>
      </div>

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
