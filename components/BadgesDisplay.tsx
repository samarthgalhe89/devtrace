import { Badge } from "@/lib/badges";

export default function BadgesDisplay({ badges }: { badges: Badge[] }) {
  const earnedBadges = badges.filter(b => b.earned);
  
  if (earnedBadges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {earnedBadges.map(badge => (
        <div 
          key={badge.id} 
          className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 text-xs font-bold shadow-sm ${badge.color} hover:scale-105 transition-all cursor-default bg-secondary/80 backdrop-blur-sm`} 
        >
          <span>{badge.icon}</span>
          <span>{badge.name}</span>

          {/* Creative Custom Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 bg-slate-900 border border-slate-700 text-white rounded-2xl text-[10px] font-normal tracking-wide shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] opacity-0 translate-y-3 skew-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:skew-y-0 pointer-events-none transition-all duration-300 ease-out z-50">
            <div className="flex flex-col gap-2">
              <span className="font-black text-sm flex items-center gap-2 drop-shadow-md pb-2 border-b border-slate-700">
                <span className="text-xl">{badge.icon}</span> {badge.name}
              </span>
              <span className="text-slate-300 leading-relaxed text-xs">{badge.description}</span>
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900 z-10" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-slate-700 mt-[1px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
