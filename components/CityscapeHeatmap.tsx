"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionData {
  totalContributions: number;
  days: ContributionDay[];
}

export default function ContributionHeatmap({ data }: { data: ContributionData }) {
  // Let's render the last 364 days (52 weeks) 
  // to give a full, recognizable GitHub-style heatmap.
  const recentDays = useMemo(() => {
    return data.days.slice(-364);
  }, [data.days]);

  // Group into weeks (7 days each) for columns
  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < recentDays.length; i += 7) {
      w.push(recentDays.slice(i, i + 7));
    }
    return w;
  }, [recentDays]);

  const maxCount = Math.max(...recentDays.map(d => d.contributionCount), 1);

  return (
    <Card className="bg-[#0D1117] border-border/50 shadow-2xl mt-8 overflow-hidden relative group">
      <CardHeader className="p-6 border-b border-white/5 relative z-10 bg-transparent">
        <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Activity Matrix
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8 relative flex items-center justify-center overflow-x-auto bg-[#0D1117] min-h-[250px] scrollbar-hide">
        {/* Subtle radial glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex gap-1.5 relative z-10 p-4">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5 relative z-0 hover:z-50 hover:-translate-y-1 transition-transform duration-300">
              {week.map((day, dIdx) => {
                const intensity = day.contributionCount / maxCount;
                
                // Classic minimal colors, but glowing
                let bgColor = "bg-[#161B22]";
                let shadow = "";
                let borderColor = "border-white/5";
                
                if (day.contributionCount > 0) {
                  if (intensity < 0.25) {
                    bgColor = "bg-[#0E4429]";
                    borderColor = "border-[#006d32]/50";
                  } else if (intensity < 0.5) {
                    bgColor = "bg-[#006D32]";
                    borderColor = "border-[#26a641]/50";
                  } else if (intensity < 0.75) {
                    bgColor = "bg-[#26A641]";
                    shadow = "shadow-[0_0_8px_rgba(38,166,65,0.4)]";
                    borderColor = "border-[#39d353]/50";
                  } else {
                    bgColor = "bg-[#39D353]";
                    shadow = "shadow-[0_0_12px_rgba(57,211,83,0.8)]";
                    borderColor = "border-[#39d353]";
                  }
                }

                let tooltipText = "Complete silence. Did you even open your laptop?";
                if (day.contributionCount === 1) tooltipText = "1 commit. Bare minimum achieved.";
                else if (day.contributionCount > 1 && day.contributionCount < 5) tooltipText = `${day.contributionCount} contributions. Solid progress.`;
                else if (day.contributionCount >= 5 && day.contributionCount < 10) tooltipText = `${day.contributionCount} contributions. Great day at the office.`;
                else if (day.contributionCount >= 10) tooltipText = `${day.contributionCount} contributions. You were absolutely on fire today! 🔥`;

                const isTopRow = dIdx < 3;

                return (
                  <div 
                    key={dIdx} 
                    className="relative group/tooltip hover:z-50"
                  >
                    <div
                      className={`relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] border ${borderColor} transition-all duration-300 group-hover/tooltip:scale-150 cursor-default z-0 group-hover/tooltip:z-20 ${bgColor} ${shadow} pointer-events-auto`}
                    />
                    {/* Custom Tooltip Popup */}
                    <div 
                      className={`absolute left-1/2 -translate-x-1/2 px-3.5 py-2.5 bg-[#1a1f2e]/95 border border-border/80 rounded-xl shadow-2xl shadow-black/80 backdrop-blur-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 w-max max-w-[200px] ${
                        isTopRow 
                          ? "top-full mt-3" 
                          : "bottom-full mb-3"
                      }`}
                    >
                      <div className="absolute inset-0 bg-emerald-500/5 rounded-xl pointer-events-none" />
                      <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1.5">
                        {new Date(day.date).toDateString()}
                      </div>
                      <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="leading-tight">{tooltipText}</span>
                      </div>
                      {/* Arrow */}
                      <div 
                        className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#1a1f2e]/95 rotate-45 ${
                          isTopRow 
                            ? "bottom-full border-l border-t border-border/80 -mb-[6px]" 
                            : "top-full border-r border-b border-border/80 -mt-[6px]"
                        }`} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
