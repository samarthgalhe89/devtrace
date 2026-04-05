"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Skull, Ghost, AlertTriangle, HeartCrack, Clock, Percent, Crosshair, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { GraveyardRepo, GraveyardStats } from "@/lib/graveyard";
import { GraveyardEulogy } from "@/lib/ai";
import { useGlobalState } from "@/components/GlobalStateProvider";

interface GraveyardData {
  graveyard: GraveyardRepo[];
  stats: GraveyardStats;
  eulogies: GraveyardEulogy[];
}

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  dead: {
    bg: "bg-red-950/30",
    border: "border-red-900/50",
    text: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  },
  zombie: {
    bg: "bg-purple-950/30",
    border: "border-purple-900/50",
    text: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  },
  dying: {
    bg: "bg-amber-950/30",
    border: "border-amber-900/50",
    text: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
  },
  alive: {
    bg: "bg-emerald-950/20",
    border: "border-emerald-900/40",
    text: "text-emerald-400",
    glow: "",
  },
};

export default function GraveyardPage() {
  const { graveyardData, setGraveyardData } = useGlobalState();
  const [data, setData] = useState<GraveyardData | null>(graveyardData);
  const [loading, setLoading] = useState(!graveyardData);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Skip fetch if we already have cached data
    if (graveyardData) return;

    const fetchGraveyard = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/graveyard");
        if (!res.ok) throw new Error("Failed to fetch graveyard data");
        const result = await res.json();
        setData(result);
        setGraveyardData(result); // Cache in global state
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchGraveyard();
  }, [graveyardData, setGraveyardData]);

  const filteredRepos = data?.graveyard.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  }) || [];

  const getEulogy = (repoName: string) =>
    data?.eulogies.find((e) => e.repoName === repoName);

  if (loading) {
    return (
      <div className="min-h-screen grid-bg p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-8 w-56 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <Card className="max-w-md text-center border-destructive/20">
          <CardContent className="p-8">
            <Skull className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Graveyard Unavailable</h2>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg p-4 sm:p-8 relative overflow-hidden">
      {/* Fog effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-purple-950/20 to-transparent fog-drift" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] fog-drift-reverse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-10 flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-sm hover:translate-x-[-2px] transition-transform flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
              <Skull className="w-8 h-8 text-red-400" /> Code Graveyard
            </h1>
            <p className="text-muted-foreground font-medium">
              Where abandoned projects rest in peace. Or not.
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-red-950/20 border-red-900/30">
            <CardContent className="p-5 text-center">
              <Skull className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-red-400">{data.stats.totalDead}</div>
              <div className="text-[10px] font-bold text-red-400/70 uppercase tracking-widest">Dead</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-950/20 border-purple-900/30">
            <CardContent className="p-5 text-center">
              <Ghost className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-purple-400">{data.stats.totalZombie}</div>
              <div className="text-[10px] font-bold text-purple-400/70 uppercase tracking-widest">Zombies</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-950/20 border-amber-900/30">
            <CardContent className="p-5 text-center">
              <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-amber-400">{data.stats.totalDying}</div>
              <div className="text-[10px] font-bold text-amber-400/70 uppercase tracking-widest">Dying</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-5 text-center">
              <Percent className="w-6 h-6 text-foreground mx-auto mb-2" />
              <div className="text-3xl font-black text-foreground">{data.stats.graveyardPercentage}%</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Graveyard Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { key: "all", label: "All Repos", count: data.graveyard.length, tooltip: "The full roster — every repo you've ever created, dead or alive." },
            { key: "dead", label: "☠️ Dead", count: data.stats.totalDead, tooltip: "Gone forever. 1+ year of silence, zero stars, zero forks. Not even a README could save them." },
            { key: "zombie", label: "💀 Zombie", count: data.stats.totalZombie, tooltip: "Has stars or forks, but you ghosted it 6+ months ago. It haunts your profile." },
            { key: "dying", label: "⚠️ Dying", count: data.stats.totalDying, tooltip: "On life support. 3–12 months since last touch. One more week of neglect and it's over." },
            { key: "alive", label: "✅ Alive", count: data.stats.totalAlive, tooltip: "Actively maintained in the last 90 days. These repos still have a pulse." },
          ].map((tab) => (
            <div key={tab.key} className="relative group/tab">
              <button
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  filter === tab.key
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-secondary/30 border-border text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.label} ({tab.count})
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-muted-foreground/20 text-[8px] font-black text-muted-foreground leading-none shrink-0">
                  i
                </span>
              </button>
              {/* Custom Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-3.5 py-2.5 bg-[#1a1f2e] border border-border/80 rounded-xl shadow-2xl shadow-black/40 text-[11px] text-foreground/90 leading-relaxed w-56 opacity-0 invisible group-hover/tab:opacity-100 group-hover/tab:visible transition-all duration-200 pointer-events-none z-50">
                {tab.tooltip}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#1a1f2e] border-r border-b border-border/80 rotate-45 -mt-[5px]" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-start items-center mb-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground gap-1.5">
          <ExternalLink className="w-3.5 h-3.5" />
          Click a card to visit its repository
        </div>

        {/* Tombstone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRepos.map((item) => {
            const style = STATUS_STYLES[item.status];
            const eulogy = getEulogy(item.repo.name);

            return (
              <a
                key={item.repo.id}
                href={item.repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card
                  className={`${style.bg} ${style.border} ${style.glow} overflow-hidden transition-all duration-300 hover:scale-[1.02] group h-full`}
                >
                  <CardContent className="p-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-lg`}>{item.statusEmoji}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${style.border} ${style.text}`}
                      >
                        {item.statusLabel}
                      </span>
                    </div>

                    {/* Repo Name */}
                    <h3 className="text-lg font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                      {item.repo.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 min-h-[2rem]">
                      {item.repo.description || "No description provided"}
                    </p>

                    {/* Meta Row */}
                    <div className="flex items-center gap-3 mb-4 text-[11px] text-muted-foreground">
                      {item.repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          {item.repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.daysSincePush}d ago
                      </span>
                      {item.repo.stargazers_count > 0 && (
                        <span>⭐ {item.repo.stargazers_count}</span>
                      )}
                    </div>

                    {/* Abandonment Risk Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                        <span className="text-muted-foreground">Abandonment Risk</span>
                        <span className={item.abandonmentRisk >= 70 ? "text-red-400" : item.abandonmentRisk >= 40 ? "text-amber-400" : "text-emerald-400"}>
                          {item.abandonmentRisk}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.abandonmentRisk >= 70
                              ? "bg-red-500"
                              : item.abandonmentRisk >= 40
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${item.abandonmentRisk}%` }}
                        />
                      </div>
                    </div>

                    {/* AI Eulogy */}
                    {eulogy && (
                      <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/5">
                        <p className="text-xs italic text-muted-foreground leading-relaxed mb-2">
                          &ldquo;{eulogy.eulogy}&rdquo;
                        </p>
                        <div className="flex items-center gap-1.5">
                          <HeartCrack className="w-3 h-3 text-red-400" />
                          <span className="text-[10px] font-bold text-red-400">
                            Cause of Death: {eulogy.causeOfDeath}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>

        {filteredRepos.length === 0 && (
          <div className="text-center py-16 opacity-50">
            <Ghost className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground font-medium">No repos match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
