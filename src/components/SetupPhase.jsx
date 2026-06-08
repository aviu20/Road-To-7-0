import { Trophy, Users, Shield } from "lucide-react";
import { formations } from "../data/legends";

const formationIcons = {
  "4-3-3": <Trophy className="w-6 h-6" />,
  "4-4-2": <Users className="w-6 h-6" />,
  "3-5-2": <Shield className="w-6 h-6" />,
};

const formationDescriptions = {
  "4-3-3": "Attacking — 4 Defenders, 3 Midfielders, 3 Forwards",
  "4-4-2": "Balanced — 4 Defenders, 4 Midfielders, 2 Forwards",
  "3-5-2": "Midfield Control — 3 Defenders, 5 Midfielders, 2 Forwards",
};

export default function SetupPhase({ onSelectFormation }) {
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
          Choose Your Formation
        </h2>

        {Object.keys(formations).map((key) => (
          <button
            key={key}
            onClick={() => onSelectFormation(key)}
            className="w-full group flex items-center gap-4 p-5 rounded-xl bg-surface border border-gray-700
                       hover:border-emerald-accent hover:bg-surface-light transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 rounded-lg bg-emerald-accent/10 text-emerald-accent group-hover:bg-emerald-accent/20 transition-colors">
              {formationIcons[key]}
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-white">{key}</div>
              <div className="text-sm text-gray-400">{formationDescriptions[key]}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
