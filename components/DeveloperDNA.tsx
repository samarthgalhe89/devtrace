"use client";

import { useEffect, useState } from "react";
import { DeveloperDNA } from "@/lib/ai";
import { Sparkles, CheckCircle2, TrendingUp, Bot } from "lucide-react";
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
      <Card className="w-full animate-pulse border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <CardContent className="p-6 lg:p-8 flex flex-col gap-8">
          {/* Top Section Skeleton */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-1/4" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* Bottom Sections Skeleton */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/4 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/4 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
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
            AI analysis temporarily unavailable. Ensure GEMINI_API_KEY is configured.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden relative group animate-fade-in w-full border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background opacity-50 z-0 pointer-events-none" />
      
      <CardContent className="relative z-10 p-6 lg:p-8">
        <div className="flex flex-col gap-8">
          
          {/* Top Section: Archetype & Summary */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                {dna.archetype}
              </h3>
            </div>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {dna.summary}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-border/50 via-border to-border/50" />

          {/* Bottom Sections: Strengths & Growth Areas (Purely Vertical) */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> Core Strengths
              </h4>
              <ul className="flex flex-col gap-3">
                {dna.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-3 bg-secondary/30 p-4 rounded-xl border border-border/50 hover:border-success/30 transition-colors">
                    <span className="text-success mt-1 shrink-0">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-warning" /> Growth Areas
              </h4>
              <ul className="flex flex-col gap-3">
                {dna.growthAreas.map((area, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-3 bg-secondary/30 p-4 rounded-xl border border-border/50 hover:border-warning/30 transition-colors">
                    <span className="text-warning mt-1 shrink-0">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>
      </CardContent>
      
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full" style={{ transition: 'all 1.5s ease' }} />
    </Card>
  );
}
