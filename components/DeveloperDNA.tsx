"use client";

import { useEffect, useState } from "react";
import { DeveloperDNA } from "@/lib/ai";
import { Sparkles, CheckCircle2, TrendingUp, Bot, Brain, Rocket, Download } from "lucide-react";
import { exportAsImage } from "@/lib/exportImage";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DeveloperDNAProps {
  username?: string; // Optional: If provided, fetches for that user; else authenticated user
}

export default function DeveloperDNAComponent({ username }: DeveloperDNAProps) {
  const [dna, setDna] = useState<DeveloperDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let ignore = false;

    const fetchDNA = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = username
          ? `/api/ai-insights?username=${username}`
          : "/api/ai-insights";

        const res = await fetch(url, { signal: abortController.signal });
        if (!res.ok) {
          throw new Error("Failed to generate insights.");
        }

        const data = await res.json();
        if (!ignore) {
          setDna(data.dna);
        }
      } catch (err: unknown) {
        if (!ignore && err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        } else if (!ignore && !(err instanceof Error)) {
          setError("An unknown error occurred");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchDNA();

    return () => {
      ignore = true;
      abortController.abort();
    };
  }, [username]);

  if (loading) {
    return (
      <Card className="w-full animate-pulse border-border bg-card shadow-sm">
        <CardContent className="p-6 lg:p-8 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <div className="h-px w-full bg-border/50" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !dna) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 text-center">
        <CardContent className="p-6">
          <Bot className="w-6 h-6 text-destructive mx-auto mb-2" />
          <p className="text-sm text-destructive font-medium">
            AI analysis temporarily unavailable.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="developer-dna-card" className="p-0 overflow-hidden relative group animate-fade-in w-full border-border bg-card shadow-sm">
      <CardContent className="relative z-10 p-6 lg:p-10">
        {/* Export Button */}
        <button
          onClick={() => exportAsImage("developer-dna-card", `${username || 'my'}-developer-dna`)}
          className="absolute top-6 right-6 lg:top-10 lg:right-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/80 text-foreground hover:bg-secondary text-xs font-bold transition-colors z-50 border border-border/50 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export DNA
        </button>
        <div className="flex flex-col gap-10">
          
          {/* Top Section: Archetype & Summary */}
          <div className="max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-black/20 shrink-0">
                <Sparkles className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                {dna.archetype}
              </h3>
            </div>

            {/* Core Personality Tags */}
            {dna.personality && dna.personality.length > 0 && (
              <div className="mb-8">
                <h4 className="text-[12px] font-extrabold text-foreground uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4" /> Core Personality
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {dna.personality?.map((trait, i) => (
                    <span key={i} className="px-5 py-2 bg-secondary/50 text-foreground text-[13px] font-semibold rounded-full border border-border shadow-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-base text-muted-foreground leading-relaxed font-normal">
              {dna.summary}
            </p>
          </div>

          <div className="h-px w-full bg-border" />

          {/* Bottom Grid: 2 Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Strengths */}
            <div className="space-y-5">
              <h4 className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Best Strengths
              </h4>
              <ul className="space-y-2.5">
                {dna.strengths.map((strength, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2.5 font-medium leading-snug">
                    <span className="text-emerald-500 shrink-0">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="space-y-5">
              <h4 className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Focus Areas
              </h4>
              <ul className="space-y-2.5">
                {dna.growthAreas.map((area, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2.5 font-medium leading-snug">
                    <span className="text-amber-500 shrink-0">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>

          </div>
          
          <div className="h-px w-full bg-border/60" />

          {/* Career Roadmap (Prominent Separate Section) */}
          <div className="w-full mt-2">
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
              <Rocket className="w-5 h-5" /> Career Roadmap
            </h4>
            <div className="flex flex-col gap-4">
              {dna.careerRoadmap?.map((tech, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-primary/10 rounded-xl border border-primary/20 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
                  <span className="text-primary shrink-0 font-medium text-lg mt-[-2px]">→</span>
                  <p className="text-[15px] xl:text-base text-card-foreground font-medium leading-relaxed">
                    {tech}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}
