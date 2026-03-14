"use client";

import { useEffect, useState } from "react";
import { DeveloperDNA } from "@/lib/ai";

interface DeveloperDNAProps {
  username?: string; // Optional: If provided, fetches for that user; else authenticated user
}

export default function DeveloperDNAComponent({ username }: DeveloperDNAProps) {
  const [dna, setDna] = useState<DeveloperDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDNA = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = username
          ? `/api/ai-insights?username=${username}`
          : "/api/ai-insights";

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to generate insights.");
        }

        const data = await res.json();
        setDna(data.dna);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDNA();
  }, [username]);

  if (loading) {
    return (
      <div className="glass-card p-6 lg:p-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column Skeleton */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 animate-spin flex items-center justify-center">
                <span className="text-[10px]">✨</span>
              </div>
              <div className="h-6 bg-surface rounded w-1/3"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-surface rounded w-full"></div>
              <div className="h-4 bg-surface rounded w-full"></div>
              <div className="h-4 bg-surface rounded w-5/6"></div>
              <div className="h-4 bg-surface rounded w-4/6"></div>
            </div>
          </div>
          {/* Right Column Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-5 bg-surface rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-surface rounded w-full"></div>
              <div className="h-4 bg-surface rounded w-4/5"></div>
              <div className="h-4 bg-surface rounded w-5/6"></div>
            </div>
            <div className="space-y-3">
              <div className="h-5 bg-surface rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-surface rounded w-full"></div>
              <div className="h-4 bg-surface rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dna) {
    return (
      <div className="glass-card p-6 border-danger/20 text-center">
        <p className="text-xl mb-2">🤖</p>
        <p className="text-sm text-danger/80">
          AI analysis temporarily unavailable. Ensure GEMINI_API_KEY is configured.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-0 overflow-hidden relative group animate-fade-in w-full">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background opacity-50 z-0" />
      
      <div className="relative z-10 p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Column: Archetype & Summary (takes 3 cols on large screens) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                <span className="text-white text-sm">✨</span>
              </div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {dna.archetype}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {dna.summary}
            </p>
          </div>

          {/* Right Column: Strengths & Growth Areas (takes 2 cols on large screens) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8 lg:ml-4">
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="text-success">◆</span> Core Strengths
              </h4>
              <ul className="space-y-2">
                {dna.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-success mt-0.5 shrink-0">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="text-warning">◆</span> Growth Areas
              </h4>
              <ul className="space-y-2">
                {dna.growthAreas.map((area, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-warning mt-0.5 shrink-0">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full" style={{ transition: 'all 1.5s ease' }} />
    </div>
  );
}
