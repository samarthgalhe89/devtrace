"use client";

import { useMemo } from "react";
import { Flame, Trophy } from "lucide-react";
import { ContributionData } from "./CityscapeHeatmap";

export default function HolographicStats({ data }: { data: ContributionData }) {
  // Calculate streaks
  const { longestStreak, currentStreak } = useMemo(() => {
    let longest = 0;
    let current = 0;
    
    // Reverse iterating to find current streak directly from today
    for (let i = data.days.length - 1; i >= 0; i--) {
      const day = data.days[i];
      if (day.contributionCount > 0) {
        current++;
      } else if (i !== data.days.length - 1) { 
        break; 
      }
    }

    // Now find longest streak overall
    let tempStreak = 0;
    for (let i = 0; i < data.days.length; i++) {
        const day = data.days[i];
        if (day.contributionCount > 0) {
            tempStreak++;
            if (tempStreak > longest) longest = tempStreak;
        } else {
            tempStreak = 0;
        }
    }

    return { longestStreak: longest, currentStreak: current };
  }, [data.days]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      
      {/* Total Contributions */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-center">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" /> Total Contributions
        </div>
        <div className="text-4xl font-black text-foreground">
          {data.totalContributions.toLocaleString()}
        </div>
      </div>

      {/* Streak */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex justify-between items-end">
        <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" /> Current Streak
            </div>
            <div className="text-4xl font-black text-foreground">
              {currentStreak} <span className="text-lg text-muted-foreground font-medium tracking-normal">days</span>
            </div>
        </div>
        <div className="text-right">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Longest</div>
            <div className="text-xl font-bold text-foreground">{longestStreak}</div>
        </div>
      </div>

    </div>
  );
}
