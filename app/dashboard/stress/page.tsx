"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  Activity,
  Brain,
  AlertTriangle,
  FileWarning,
  Heart,
  Wrench,
  BarChart3,
  Gauge,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { CommitSentiment, StressAggregated } from "@/lib/stress";
import { StressReport } from "@/lib/ai";
import { useGlobalState } from "@/components/GlobalStateProvider";

interface StressData {
  sentiments: CommitSentiment[];
  aggregated: StressAggregated;
  report: StressReport;
}

function StressGauge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-red-400"
      : score >= 50
        ? "text-orange-400"
        : score >= 30
          ? "text-amber-400"
          : "text-emerald-400";



  const label =
    score >= 70
      ? "Critical"
      : score >= 50
        ? "Elevated"
        : score >= 30
          ? "Moderate"
          : "Optimal";

  const circumference = 2 * Math.PI * 80;
  const filled = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-card border border-border">
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-secondary"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black ${color}`}>{score}</span>
          <span className="text-xs text-muted-foreground font-bold">/100</span>
        </div>
      </div>
      <div className={`text-sm font-bold ${color}`}>{label}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
        Commit Friction Index
      </div>
    </div>
  );
}

function StressBar({
  label,
  value,
  maxValue = 100,
}: {
  label: string;
  value: number;
  maxValue?: number;
}) {
  const pct = Math.min(100, (value / maxValue) * 100);
  const color =
    value >= 60
      ? "bg-red-500"
      : value >= 40
        ? "bg-orange-500"
        : value >= 25
          ? "bg-amber-500"
          : "bg-emerald-500";

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-28 text-xs font-semibold text-foreground truncate text-right">
        {label}
      </div>
      <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className={`w-10 text-xs font-bold text-right ${
          value >= 60 ? "text-red-400" : value >= 40 ? "text-orange-400" : "text-muted-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function StressPage() {
  const { stressData: cachedStressData, setStressData: setCachedStressData } = useGlobalState();
  const [data, setData] = useState<StressData | null>(cachedStressData);
  const [loading, setLoading] = useState(!cachedStressData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetch if we already have cached data
    if (cachedStressData) return;

    const fetchStress = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/stress");
        if (!res.ok) throw new Error("Failed to fetch stress data");
        const result = await res.json();
        setData(result);
        setCachedStressData(result); // Cache in global state
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchStress();
  }, [cachedStressData, setCachedStressData]);

  // Build the frustration heatmap: 7 rows (days) × weeks columns
  const heatmapData = useMemo(() => {
    if (!data?.sentiments) return null;

    const dayBuckets: Map<string, { stress: number; count: number; message: string }> = new Map();

    data.sentiments.forEach((s) => {
      if (!s.date) return;
      const d = new Date(s.date);
      const dateKey = d.toISOString().split("T")[0];
      const existing = dayBuckets.get(dateKey) || { stress: 0, count: 0, message: "" };
      existing.stress += s.stressScore;
      existing.count++;
      if (s.stressScore > (dayBuckets.get(dateKey)?.stress || 0) / Math.max(existing.count - 1, 1)) {
        existing.message = s.message;
      }
      dayBuckets.set(dateKey, existing);
    });

    return dayBuckets;
  }, [data?.sentiments]);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 rounded-xl col-span-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
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
            <Brain className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Stress Analysis Unavailable</h2>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { aggregated, report, sentiments } = data;

  // Top 5 most frustrated commits
  const wallOfShame = [...sentiments]
    .filter((s) => s.sentiment === "frustrated")
    .sort((a, b) => b.stressScore - a.stressScore)
    .slice(0, 5);

  return (
    <div className="min-h-screen grid-bg p-4 sm:p-8 relative overflow-hidden">
      {/* Red ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-600/8 rounded-full blur-[150px]" />
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
              <Activity className="w-8 h-8 text-red-400" /> Commit Sentiment Analysis
            </h1>
            <p className="text-muted-foreground font-medium">
              Friction patterns derived from commit message sentiment across your repositories.
            </p>
          </div>
        </header>

        {/* Top Section: Gauge + Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stress Gauge */}
          <StressGauge score={aggregated.overallStressScore} />

          {/* Quick Stats */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5" /> Commits Analyzed
                </div>
                <div className="text-3xl font-black text-foreground">
                  {aggregated.totalCommitsAnalyzed}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> High-Friction Commits
                </div>
                <div className="text-3xl font-black text-red-400">
                  {sentiments.filter((s) => s.sentiment === "frustrated").length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> Highest Friction Language
                </div>
                <div className="text-xl font-black text-foreground">
                  {aggregated.stressByLanguage[0]?.language || "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Friction Index: {aggregated.stressByLanguage[0]?.avgStress || 0}/100
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-emerald-400" /> Lowest Friction Language
                </div>
                <div className="text-xl font-black text-foreground">
                  {aggregated.stressByLanguage[aggregated.stressByLanguage.length - 1]?.language || "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Friction Index: {aggregated.stressByLanguage[aggregated.stressByLanguage.length - 1]?.avgStress || 0}/100
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stress by Language & Day */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* By Language */}
          <Card className="bg-card border-border">
            <CardHeader className="p-5 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-red-400" /> Friction by Language
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {aggregated.stressByLanguage.length > 0 ? (
                <div className="space-y-1">
                  {aggregated.stressByLanguage.map((item) => (
                    <StressBar
                      key={item.language}
                      label={item.language}
                      value={item.avgStress}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No language data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* By Day of Week */}
          <Card className="bg-card border-border">
            <CardHeader className="p-5 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-400" /> Friction by Day of Week
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {aggregated.stressByDayOfWeek.length > 0 ? (
                <div className="space-y-1">
                  {aggregated.stressByDayOfWeek.map((item) => (
                    <StressBar
                      key={item.day}
                      label={item.day.slice(0, 3)}
                      value={item.avgStress}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No day data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stress by Repo */}
        {aggregated.stressByRepo.length > 0 && (
          <Card className="bg-card border-border mb-8">
            <CardHeader className="p-5 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" /> Friction by Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {aggregated.stressByRepo.slice(0, 10).map((item) => (
                  <StressBar key={item.repo} label={item.repo} value={item.avgStress} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* High-Friction Commits */}
        {wallOfShame.length > 0 && (
          <Card className="bg-card border-border mb-8 overflow-hidden">
            <CardHeader className="p-5 border-b bg-red-950/20">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-red-400">
                <FileWarning className="w-4 h-4" /> High-Friction Commits — Elevated Sentiment Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {wallOfShame.map((commit, i) => (
                <div
                  key={i}
                  className="p-5 flex items-start gap-4 hover:bg-red-950/10 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      i === 0
                        ? "bg-red-500/20 text-red-400"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1 break-words">
                      &ldquo;{commit.message}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="font-semibold">{commit.repo}</span>
                      <span>·</span>
                      <span>{commit.language}</span>
                      <span>·</span>
                      <span>{commit.dayOfWeek}</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-red-400 shrink-0">
                    {commit.stressScore}/100
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* AI Productivity Analysis */}
        {report && (
          <Card className="mb-8 overflow-hidden relative">
            <CardHeader className="p-6 border-b bg-gradient-to-r from-indigo-950/30 via-secondary/30 to-secondary/10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> AI Productivity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                {/* Executive Summary */}
                <div className="mb-8 text-center">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                    Executive Summary
                  </div>
                  <p className="text-base font-medium text-foreground leading-relaxed">
                    {report.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                        Highest-Friction Language
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium">
                      {report.triggerLanguage}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-950/20 rounded-xl border border-orange-900/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-4 h-4 text-orange-400" />
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                        Peak Friction Day
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium">
                      {report.triggerDay}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-emerald-950/20 rounded-xl border border-emerald-900/30 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      Recommendation
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    {report.recommendation}
                  </p>
                </div>

                <div className="p-5 bg-secondary/30 rounded-xl border border-border text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Key Insight
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-medium">{report.insight}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
