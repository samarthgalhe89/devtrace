"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitPullRequest, CircleDot, Network } from "lucide-react";
import { CollaborationStatsData } from "@/lib/github";

export default function CollaborationStats({ data }: { data: CollaborationStatsData }) {
  if (!data) return null;

  return (
    <Card className="bg-card border-border shadow-sm animate-fade-in relative z-0 overflow-hidden">
      <CardHeader className="p-6 border-b bg-secondary/30 text-card-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay"></div>
        <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <Network className="w-4 h-4 text-indigo-400" /> Collaboration Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center p-6 bg-secondary/20 border border-border/50 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
          <GitPullRequest className="w-8 h-8 text-indigo-500 mb-4" />
          <span className="text-4xl font-black text-foreground mb-2">{data.totalPullRequests.toLocaleString()}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pull Requests Opened</span>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-secondary/20 border border-border/50 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
          <CircleDot className="w-8 h-8 text-emerald-500 mb-4" />
          <span className="text-4xl font-black text-foreground mb-2">{data.totalIssues.toLocaleString()}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Issues Tracked</span>
        </div>
      </CardContent>
    </Card>
  );
}
