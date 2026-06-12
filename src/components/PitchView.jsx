import { formationPositions } from "../data/legends";

const roleColors = {
  GK: "#f59e0b",
  LB: "#3b82f6", CB: "#3b82f6", RB: "#3b82f6",
  CDM: "#10b981", CM: "#10b981", CAM: "#10b981",
  LW: "#ef4444", RW: "#ef4444", ST: "#ef4444",
};

export default function PitchView({ formationKey, slots, currentSlot, compact = false }) {
  const positions = formationPositions[formationKey];
  if (!positions) return null;

  const dotSize = compact ? "w-6 h-6" : "w-8 h-8";
  const dotText = compact ? "text-[9px]" : "text-xs";
  const nameText = compact ? "text-[8px] max-w-12" : "text-[10px] max-w-16";
  const circleSize = compact ? "w-16 h-16" : "w-24 h-24";
  const penaltyW = compact ? "w-28" : "w-40";
  const penaltyH = compact ? "h-10" : "h-16";
  const goalW = compact ? "w-14" : "w-20";
  const goalH = compact ? "h-4" : "h-6";

  return (
    <div className={`relative w-full mx-auto rounded-xl overflow-hidden border border-emerald-accent/30 ${
      compact ? "max-w-xs aspect-[3/4]" : "max-w-md aspect-[3/4]"
    }`}>
      {/* Pitch background */}
      <div className="absolute inset-0 bg-gradient-to-b from-pitch to-pitch-light">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${circleSize} rounded-full border border-white/20`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${penaltyW} ${penaltyH} border-b border-x border-white/20`} />
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${penaltyW} ${penaltyH} border-t border-x border-white/20`} />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${goalW} ${goalH} border-b border-x border-white/15`} />
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${goalW} ${goalH} border-t border-x border-white/15`} />
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
              className={`${dotSize} rounded-full flex items-center justify-center ${dotText} font-bold border-2 transition-all
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
            <span className={`${nameText} mt-0.5 truncate text-center leading-tight
              ${filled ? "text-white font-medium" : "text-white/40"}`}>
              {filled ? playerName : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
