import { useState, useEffect } from "react";
import { RotateCcw, Zap, Trophy } from "lucide-react";
import { roleLabels } from "../data/legends";
import PlayerCard from "./PlayerCard";
import PitchView from "./PitchView";

const FLAG_EMOJIS = ["🇧🇷", "🇦🇷", "🇩🇪", "🇫🇷", "🇮🇹", "🇳🇱", "🇬🇧", "🇺🇾", "🇪🇸", "🇵🇹", "🇭🇷", "🇲🇦", "🇺🇸"];
const YEARS = [1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026];

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
    <div className="min-h-screen px-3 sm:px-4 py-4 sm:py-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-white flex items-center gap-2 uppercase tracking-tight">
              Round {filledCount + 1}<span className="text-gray-500">/11</span>
              {isFinalPick && <Trophy className="w-5 h-5 text-gold animate-pulse" />}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Picking: <span className="text-emerald-accent font-semibold">{roleLabels[currentRole]}</span>
            </p>
          </div>
          <button
            onClick={onRespin}
            disabled={respinsLeft === 0 || spinning}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-lg bg-gold/10 text-gold border border-gold/30
                       hover:bg-gold/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Re-spin ({respinsLeft})
          </button>
        </div>

        {/* Draft progress bar */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-2 sm:h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFinalPick ? "bg-gradient-to-r from-gold to-yellow-300" : "bg-emerald-accent"
                }`}
                style={{ width: `${((filledCount) / 11) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-mono">{filledCount}/11</span>
          </div>
          <p className={`text-xs ${
            flavor.vibe === "final" ? "text-gold font-semibold" :
            flavor.vibe === "tense" ? "text-emerald-accent" :
            "text-gray-500"
          }`}>
            {flavor.message}
          </p>
        </div>

        {/* Slot Machine Display */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-surface/80 border backdrop-blur-sm transition-all surface-noise ${
            isFinalPick ? "border-gold/50" : "border-gray-700/60"
          } ${spinning ? "animate-pulse" : ""}`}>
            <span className="text-3xl relative z-10">{spinning ? spinDisplay.flag : "⚽"}</span>
            <div className="text-center relative z-10">
              <div className="font-display text-xl text-white uppercase tracking-wider">
                {spinning ? spinDisplay.year : "PICK!"}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                {spinning ? "Scanning..." : "Choose your legend"}
              </div>
            </div>
            <Zap className={`w-5 h-5 relative z-10 ${spinning ? "text-gold animate-spin" : "text-emerald-accent"}`} />
          </div>
        </div>

        {/* Mobile formation — compact, always visible */}
        <div className="lg:hidden mb-4">
          <PitchView formationKey={formationKey} slots={slots} currentSlot={currentSlot} compact />
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Desktop formation — full size */}
          <div className="hidden lg:block lg:col-span-1">
            <PitchView formationKey={formationKey} slots={slots} currentSlot={currentSlot} />
          </div>

          <div className="lg:col-span-2">
            {!spinning && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {choices.map((player, i) => (
                  <div key={player.id} className="animate-card-enter" style={{ animationDelay: `${i * 0.08}s` }}>
                    <PlayerCard player={player} onPick={() => onPick(player)} />
                  </div>
                ))}
              </div>
            )}
            {spinning && (
              <div className="flex items-center justify-center h-36 sm:h-48 text-gray-500 text-sm">
                Scanning World Cup archives...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
