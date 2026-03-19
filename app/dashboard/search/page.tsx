"use client";

import { useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import RepoStatsCards from "@/components/RepoStats";
import LanguageChart from "@/components/LanguageChart";
import RepoHealthTable from "@/components/RepoHealthTable";
import ActivityChart from "@/components/ActivityChart";
import DeveloperDNAComponent from "@/components/DeveloperDNA";
import { GitHubUser, GitHubRepo } from "@/lib/github";
import { RepoStats, LanguageStat } from "@/lib/analytics";
import { RepoHealth } from "@/lib/scoring";
import { ActivityTimelinePoint } from "@/lib/activity";
import { Search } from "lucide-react";

interface DashboardData {
  user: GitHubUser;
  repos: GitHubRepo[];
  stats: RepoStats;
  languages: LanguageStat[];
  healthScores: RepoHealth[];
  activity: ActivityTimelinePoint[];
}

export default function SearchPage() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setData(null);
      const res = await fetch(`/api/github?username=${username.trim()}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to find user");
      }

      const result = await res.json();
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg">
      <header className="border-b border-border px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-40 lg:hidden">
        <h1 className="text-sm font-bold">
          <span className="gradient-text">Search Developers</span>
        </h1>
      </header>

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Input Section */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Analyze any Developer</h2>
            <p className="text-muted-foreground">Enter a GitHub username to generate AI insights and GitHub stats.</p>
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-accent" />
            </div>
            <input
              type="text"
              placeholder="e.g. torvalds"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-12 pr-32 py-4 text-lg bg-surface/50 border border-border shadow-sm rounded-2xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
              <button 
                type="submit" 
                disabled={!username.trim() || loading}
                className="glow-button h-full px-6 rounded-xl font-medium disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? "Searching..." : "Analyze"}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm text-center animate-fade-in">
              {error}
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex flex-col gap-8">
            {/* Profile banner skeleton */}
            <div className="glass-card p-6 h-48 animate-pulse skeleton" />
            
            {/* KPI skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="skeleton h-32 rounded-xl" />
              <div className="skeleton h-32 rounded-xl" />
              <div className="skeleton h-32 rounded-xl" />
              <div className="skeleton h-32 rounded-xl" />
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="skeleton h-[320px] rounded-xl" />
              <div className="skeleton h-[320px] rounded-xl" />
            </div>
            
            {/* Bottom Skeleton */}
            <div className="flex flex-col gap-8 w-full mt-2">
               <div className="skeleton h-48 rounded-xl w-full" />
               <div className="skeleton h-[400px] rounded-xl w-full" />
            </div>
          </div>
        )}

        {/* Results Container */}
        {data && !loading && (
          <div className="flex flex-col gap-8 animate-fade-in">
            
            {/* Top Banner: Profile */}
            <ProfileCard user={data.user} />
            
            {/* Phase 3: Repo Stats Cards */}
            <RepoStatsCards stats={data.stats} />

            {/* Two Column Grid for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Phase 4: Activity Area Chart */}
              <ActivityChart data={data.activity} />
              
              {/* Phase 3: Language Distribution */}
              <LanguageChart data={data.languages} />
            </div>

            {/* AI Insights Banner */}
            <div className="w-full">
              {/* Phase 5: AI Insights */}
              <DeveloperDNAComponent username={data.user.login} />
            </div>

            {/* Bottom Full Width Section */}
            <div className="w-full mt-2">
              {/* Phase 4: Repository Health Table */}
              <RepoHealthTable data={data.healthScores} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
