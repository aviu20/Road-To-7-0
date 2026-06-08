import { useState, useEffect } from "react";
import { RotateCcw, Zap } from "lucide-react";
import { positionLabels } from "../data/legends";
import PlayerCard from "./PlayerCard";
import PitchView from "./PitchView";

const FLAG_EMOJIS = ["🇧🇷", "🇦🇷", "🇩🇪", "🇫🇷", "🇮🇹", "🇳🇱", "🇬🇧", "🇺🇾", "🇪🇸", "🇵🇹", "🇭🇷", "🇲🇦"];
const YEARS = [1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022];

export default function DraftPhase({ formationKey, slots, currentSlot, choices, respinsLeft, onPick, onRespin }) {
  const [spinning, setSpinning] = useState(true);
  const [spinDisplay, setSpinDisplay] = useState({ flag: "🌍", year: "????" });

  useEffect(() => {
    setSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setSpinDisplay({
        flag: FLAG_EMOJIS[Math.floor(Math.random() * FLAG_EMOJIS.length)],
        year: YEARS[Math.floor(Math.random() * YEARS.length)],
      });
      count++;
      if (count > 12) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [currentSlot]);

  const currentPosition = slots[currentSlot]?.position;
  const filledCount = slots.filter((s) => s.filled).length;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Draft Round {filledCount + 1}/11</h2>
            <p className="text-gray-400">
              Picking: <span className="text-emerald-accent font-semibold">{positionLabels[currentPosition]}</span>
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

        {/* Slot Machine Display */}
        <div className="flex justify-center mb-8">
          <div className={`flex items-center gap-4 px-8 py-4 rounded-xl bg-surface border border-gray-700
                          ${spinning ? "animate-pulse" : ""}`}>
            <span className="text-4xl">{spinning ? spinDisplay.flag : "⚽"}</span>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-white">
                {spinning ? spinDisplay.year : "PICK!"}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                {spinning ? "Scanning eras..." : "Choose your legend"}
              </div>
            </div>
            <Zap className={`w-6 h-6 ${spinning ? "text-gold animate-spin" : "text-emerald-accent"}`} />
          </div>
        </div>

        {/* Main layout: pitch + cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pitch View */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <PitchView formationKey={formationKey} slots={slots} currentSlot={currentSlot} />
          </div>

          {/* Draft Choices */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {!spinning && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {choices.map((player) => (
                  <PlayerCard key={player.id} player={player} onPick={() => onPick(player)} />
                ))}
              </div>
            )}
            {spinning && (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Scanning World Cup archives...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
