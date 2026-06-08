import { formationPositions } from "../data/legends";

const positionColors = {
  GK: "#f59e0b",
  DEF: "#3b82f6",
  MID: "#10b981",
  FW: "#ef4444",
};

export default function PitchView({ formationKey, slots, currentSlot }) {
  const positions = formationPositions[formationKey];
  if (!positions) return null;

  const allDots = [];
  let slotIndex = 0;

  for (const pos of ["GK", "DEF", "MID", "FW"]) {
    const coords = positions[pos];
    for (let i = 0; i < coords.length; i++) {
      allDots.push({
        pos,
        x: coords[i].x,
        y: coords[i].y,
        slot: slots[slotIndex],
        index: slotIndex,
      });
      slotIndex++;
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-xl overflow-hidden border border-emerald-accent/30">
      {/* Pitch background */}
      <div className="absolute inset-0 bg-gradient-to-b from-pitch to-pitch-light">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30" />
        {/* Halfway line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
        {/* Penalty areas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-16 border-b border-x border-white/20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 border-t border-x border-white/20" />
        {/* Goal boxes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 border-b border-x border-white/15" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 border-t border-x border-white/15" />
      </div>

      {/* Player dots */}
      {allDots.map((dot, i) => {
        const filled = dot.slot?.filled;
        const isCurrent = dot.index === currentSlot;
        const color = positionColors[dot.pos];
        const playerName = dot.slot?.player?.name?.split(" ").pop();

        return (
          <div
            key={i}
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${filled
                  ? "text-white shadow-lg"
                  : isCurrent
                  ? "animate-pulse border-dashed"
                  : "opacity-50 border-dashed"
                }`}
              style={{
                backgroundColor: filled ? color : "transparent",
                borderColor: color,
                boxShadow: filled ? `0 0 12px ${color}50` : "none",
              }}
            >
              {filled ? (dot.slot.player.rating) : dot.pos}
            </div>
            <span className={`text-[10px] mt-0.5 max-w-16 truncate text-center leading-tight
              ${filled ? "text-white font-medium" : "text-white/40"}`}>
              {filled ? playerName : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
