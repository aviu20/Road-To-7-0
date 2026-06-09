import { formationPositions } from "../data/legends";

const roleColors = {
  GK: "#f59e0b",
  LB: "#3b82f6", CB: "#3b82f6", RB: "#3b82f6",
  CDM: "#10b981", CM: "#10b981", CAM: "#10b981",
  LW: "#ef4444", RW: "#ef4444", ST: "#ef4444",
};

export default function PitchView({ formationKey, slots, currentSlot }) {
  const positions = formationPositions[formationKey];
  if (!positions) return null;

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
      {positions.map((pos, i) => {
        const slot = slots[i];
        const filled = slot?.filled;
        const isCurrent = i === currentSlot;
        const color = roleColors[pos.role] || "#10b981";
        const playerName = slot?.player?.name?.split(" ").pop();

        return (
          <div
            key={i}
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
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
              {filled ? slot.player.rating : pos.role}
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
