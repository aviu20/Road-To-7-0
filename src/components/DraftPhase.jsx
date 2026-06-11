import { useState, useEffect } from "react";
import { RotateCcw, Zap, Trophy } from "lucide-react";
import { roleLabels } from "../data/legends";
import PlayerCard from "./PlayerCard";
import PitchView from "./PitchView";

const FLAG_EMOJIS = ["🇧🇷", "🇦🇷", "🇩🇪", "🇫🇷", "🇮🇹", "🇳🇱", "🇬🇧", "🇺🇾", "🇪🇸", "🇵🇹", "🇭🇷", "🇲🇦", "🇺🇸"];
const YEARS = [1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026];

// Draft tension messages per round range
const DRAFT_FLAVOR = [
  { range: [0, 2], message: "Building your foundation...", vibe: "calm" },
  { range: [3, 5], message: "The squad is taking shape...", vibe: "building" },
  { range: [6, 8], message: "Key positions remain!", vibe: "tense" },
  { range: [9, 9], message: "The penultimate pick!", vibe: "tense" },
  { range: [10, 10], message: "FINAL PICK — make it count!", vibe: "final" },
];

function getDraftFlavor(roundIndex) {
  return DRAFT_FLAVOR.find(f => roundIndex >= f.range[0] && roundIndex <= f.range[1]) || DRAFT_FLAVOR[0];
}

export default function DraftPhase({ formationKey, slots, currentSlot, choices, respinsLeft, onPick, onRespin }) {
  const [spinning, setSpinning] = useState(true);
  const [spinDisplay, setSpinDisplay] = useState({ flag: "🌍", year: "????" });

  const filledCount = slots.filter((s) => s.filled).length;
  const flavor = getDraftFlavor(filledCount);
  const isFinalPick = filledCount === 10;

  // Faster spinner: 5 ticks × 70ms = 350ms (down from 12 × 100ms = 1200ms)
  useEffect(() => {
    setSpinning(true);
    let count = 0;
    const ticks = isFinalPick ? 8 : 5;
    const interval = setInterval(() => {
      setSpinDisplay({
        flag: FLAG_EMOJIS[Math.floor(Math.random() * FLAG_EMOJIS.length)],
        year: YEARS[Math.floor(Math.random() * YEARS.length)],
      });
      count++;
      if (count > ticks) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [currentSlot, isFinalPick]);

  const currentRole = slots[currentSlot]?.role;

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Draft Round {filledCount + 1}/11
              {isFinalPick && <Trophy className="w-5 h-5 text-gold animate-pulse" />}
            </h2>
            <p className="text-gray-400">
              Picking: <span className="text-emerald-accent font-semibold">{roleLabels[currentRole]}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRespin}
              disabled={respinsLeft === 0 || spinning}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 text-gold border border-gold/30
                         hover:bg-gold/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Re-spin ({respinsLeft})
            </button>
          </div>
        </div>

        {/* Draft progress bar */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-1.5 rounded-full bg-gray-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFinalPick ? "bg-gradient-to-r from-gold to-yellow-300" : "bg-emerald-accent"
                }`}
                style={{ width: `${((filledCount) / 11) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{filledCount}/11</span>
          </div>
          <p className={`text-xs ${
            flavor.vibe === "final" ? "text-gold font-semibold" :
            flavor.vibe === "tense" ? "text-emerald-accent" :
            "text-gray-500"
          }`}>
            {flavor.message}
          </p>
        </div>

        {/* Slot Machine Display — compact */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-xl bg-surface border transition-all ${
            isFinalPick ? "border-gold/50" : "border-gray-700"
          } ${spinning ? "animate-pulse" : ""}`}>
            <span className="text-3xl">{spinning ? spinDisplay.flag : "⚽"}</span>
            <div className="text-center">
              <div className="text-xl font-mono font-bold text-white">
                {spinning ? spinDisplay.year : "PICK!"}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                {spinning ? "Scanning..." : "Choose your legend"}
              </div>
            </div>
            <Zap className={`w-5 h-5 ${spinning ? "text-gold animate-spin" : "text-emerald-accent"}`} />
          </div>
        </div>

        {/* Main layout: cards first on mobile, pitch sidebar on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pitch View — hidden on mobile until tapped, sidebar on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <PitchView formationKey={formationKey} slots={slots} currentSlot={currentSlot} />
          </div>

          {/* Draft Choices — always first on mobile */}
          <div className="lg:col-span-2">
            {!spinning && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {choices.map((player) => (
                  <PlayerCard key={player.id} player={player} onPick={() => onPick(player)} />
                ))}
              </div>
            )}
            {spinning && (
              <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                Scanning World Cup archives...
              </div>
            )}
          </div>
        </div>

        {/* Mobile pitch — collapsible */}
        <details className="lg:hidden mt-6">
          <summary className="text-xs text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition-colors">
            View Formation
          </summary>
          <div className="mt-3">
            <PitchView formationKey={formationKey} slots={slots} currentSlot={currentSlot} />
          </div>
        </details>
      </div>
    </div>
  );
}
