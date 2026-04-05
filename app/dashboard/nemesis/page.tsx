"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Swords, Zap, Crown, Shield, Target, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { NemesisProfile, RivalryScore } from "@/lib/nemesis";
import { NemesisNarrative } from "@/lib/ai";
import { useGlobalState } from "@/components/GlobalStateProvider";

interface NemesisData {
  nemesis: NemesisProfile | null;
  narrative: NemesisNarrative | null;
  rivalry: RivalryScore | null;
  user: { login: string; avatar_url: string; name: string | null; followers: number; public_repos: number };
  userStats: { totalStars: number; totalForks: number };
  userLanguages: { name: string }[];
  message?: string;
}

export default function NemesisPage() {
  const { nemesisData, setNemesisData } = useGlobalState();
  const [data, setData] = useState<NemesisData | null>(nemesisData);
  const [loading, setLoading] = useState(!nemesisData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetch if we already have cached data
    if (nemesisData) return;

    const fetchNemesis = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/nemesis");
        if (!res.ok) throw new Error("Failed to find nemesis");
        const result = await res.json();
        setData(result);
        setNemesisData(result); // Cache in global state
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchNemesis();
  }, [nemesisData, setNemesisData]);

  if (loading) {
    return (
      <div className="min-h-screen grid-bg p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-8 w-56 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
          {/* Hero skeleton */}
          <Skeleton className="h-72 rounded-xl mb-8" />
          {/* Scoreboard skeleton */}
          <Skeleton className="h-64 rounded-xl mb-8" />
          {/* Narrative skeleton */}
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <Card className="max-w-md text-center border-destructive/20">
          <CardContent className="p-8">
            <Target className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Nemesis Search Failed</h2>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data.nemesis) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No Nemesis Found</h2>
            <p className="text-muted-foreground mb-6">
              {data.message || "You're truly unique — no one matches your coding DNA."}
            </p>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { nemesis, narrative, rivalry, user } = data;

  return (
    <div className="min-h-screen grid-bg p-4 sm:p-8 relative overflow-hidden">


      <div className="max-w-5xl mx-auto relative z-10">
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
              <Target className="w-8 h-8 text-red-400" /> Arch-Nemesis
            </h1>
            <p className="text-muted-foreground font-medium">
              Your algorithmic coding rival has been identified.
            </p>
          </div>
        </header>

        {/* Hero Panel — VS Split */}
        <Card className="mb-8 overflow-hidden border-border relative">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* User Side */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950/30 to-transparent relative">
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    Hero
                  </span>
                </div>
                <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group cursor-pointer">
                  <Avatar className="w-24 h-24 ring-4 ring-blue-500/30 mb-4 group-hover:scale-105 transition-transform">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{user.login?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-blue-400 transition-colors">{user.name || user.login}</h3>
                  <p className="text-sm text-blue-400 font-semibold group-hover:underline">@{user.login}</p>
                </a>
                <div className="mt-4 text-xs text-muted-foreground">
                  {user.followers?.toLocaleString()} followers · {user.public_repos} repos
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center justify-center py-4 md:py-0 md:px-0 relative">
                <div className="hidden md:block absolute top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-primary to-red-500/50" />
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center z-10 border-4 border-background">
                  <Zap className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Nemesis Side */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gradient-to-bl from-red-950/30 to-transparent relative">
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    Nemesis
                  </span>
                </div>
                <a href={`https://github.com/${nemesis.user.login}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group cursor-pointer">
                  <Avatar className="w-24 h-24 ring-4 ring-red-500/30 mb-4 group-hover:scale-105 transition-transform">
                    <AvatarImage src={nemesis.user.avatar_url} />
                    <AvatarFallback>{nemesis.user.login?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-red-400 transition-colors">{nemesis.user.name || nemesis.user.login}</h3>
                  <p className="text-sm text-red-400 font-semibold group-hover:underline">@{nemesis.user.login}</p>
                </a>
                <div className="mt-4 text-xs text-muted-foreground">
                  {nemesis.user.followers?.toLocaleString()} followers · {nemesis.user.public_repos} repos
                </div>
              </div>
            </div>

            {/* Similarity Score Banner */}
            <div className="bg-secondary/50 border-t border-border px-6 py-3 flex items-center justify-center gap-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {nemesis.similarityScore}% DNA Match
              </span>
              <span className="text-xs text-muted-foreground">— eerily similar coding profiles</span>
            </div>
          </CardContent>
        </Card>

        {/* Rivalry Scoreboard */}
        {rivalry && (
          <Card className="mb-8 overflow-hidden">
            <CardHeader className="p-6 border-b bg-secondary/30 text-center">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Swords className="w-4 h-4 text-primary" /> Rivalry Scoreboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {rivalry.categories.map((cat) => (
                  <div
                    key={cat.label}
                    className="flex items-center py-4 px-6 hover:bg-secondary/10 transition-colors"
                  >
                    <div
                      className={`flex-1 text-right pr-6 text-lg font-bold transition-all ${
                        cat.winner === "user"
                          ? "text-blue-400 scale-105"
                          : "text-foreground/40"
                      }`}
                    >
                      {(cat.userValue ?? 0).toLocaleString()}
                      {cat.winner === "user" && (
                        <Crown className="w-4 h-4 text-blue-400 inline ml-2" />
                      )}
                    </div>
                    <div className="px-4 py-1 rounded bg-secondary text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[140px] text-center">
                      {cat.label}
                    </div>
                    <div
                      className={`flex-1 pl-6 text-lg font-bold transition-all ${
                        cat.winner === "nemesis"
                          ? "text-red-400 scale-105"
                          : "text-foreground/40"
                      }`}
                    >
                      {cat.winner === "nemesis" && (
                        <Crown className="w-4 h-4 text-red-400 inline mr-2" />
                      )}
                      {(cat.nemesisValue ?? 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Tally */}
              <div className="bg-secondary/30 border-t border-border p-6 flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-400">{rivalry.userWins}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    You
                  </div>
                </div>
                <div className="text-muted-foreground font-bold text-lg">—</div>
                <div className="text-center">
                  <div className="text-2xl font-black text-red-400">{rivalry.nemesisWins}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Nemesis
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Narrative */}
        {narrative && (
          <Card className="mb-8 overflow-hidden relative">
            <CardHeader className="p-6 border-b bg-gradient-to-r from-blue-950/30 via-secondary/30 to-red-950/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> AI Rivalry Narrative
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-black text-foreground mb-6">
                  {narrative.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8 font-medium text-base">
                  {narrative.story}
                </p>

                {/* Edges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-blue-950/20 rounded-xl border border-blue-900/30 text-left">
                    <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> Your Edges
                    </h4>
                    <ul className="space-y-2">
                      {narrative.userEdges.map((edge, i) => (
                        <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                          <span className="text-blue-400 shrink-0">▸</span> {edge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/30 text-left">
                    <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> Nemesis Edges
                    </h4>
                    <ul className="space-y-2">
                      {narrative.nemesisEdges.map((edge, i) => (
                        <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                          <span className="text-red-400 shrink-0">▸</span> {edge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Prediction */}
                <div className="p-5 bg-secondary/30 rounded-xl border border-border">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    AI Prediction
                  </div>
                  <p className="font-bold text-foreground">{narrative.prediction}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Challenge CTA */}
        {nemesis && (
          <div className="text-center mb-8">
            <Link href={`/dashboard/versus?user1=${user.login}&user2=${nemesis.user.login}`}>
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-sm font-bold rounded-xl transition-all">
                <Swords className="w-5 h-5 mr-2" />
                Full Head-to-Head in Versus Mode →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
