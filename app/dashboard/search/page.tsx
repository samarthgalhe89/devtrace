"use client";

import { useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import RepoStatsCards from "@/components/RepoStats";
import LanguageChart from "@/components/LanguageChart";
import RepoHealthTable from "@/components/RepoHealthTable";
import ActivityChart from "@/components/ActivityChart";
import DeveloperDNAComponent from "@/components/DeveloperDNA";
import CityscapeHeatmap from "@/components/CityscapeHeatmap";
import HolographicStats from "@/components/HolographicStats";
import CollaborationStats from "@/components/CollaborationStats";
import { GitHubUser, GitHubRepo, CollaborationStatsData } from "@/lib/github";
import { RepoStats, LanguageStat } from "@/lib/analytics";
import { RepoHealth } from "@/lib/scoring";
import { ActivityTimelinePoint } from "@/lib/activity";
import { Search } from "lucide-react";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useGlobalState } from "@/components/GlobalStateProvider";
import { evaluateBadges } from "@/lib/badges";

interface DashboardData {
  user: GitHubUser;
  repos: GitHubRepo[];
  stats: RepoStats;
  languages: LanguageStat[];
  healthScores: RepoHealth[];
  activity: ActivityTimelinePoint[];
  contributions?: any;
  collaboration?: CollaborationStatsData;
}

export default function SearchPage() {
  const { searchUsername: username, setSearchUsername: setUsername, searchData: data, setSearchData: setData } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const { recentSearches, addSearch } = useRecentSearches("search");

  const handleSearch = async (e: React.FormEvent | string) => {
    let query = typeof e === "string" ? e : username;
    if (typeof e !== "string") {
      e.preventDefault();
    }
    
    setShowDropdown(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setData(null);
      setUsername(query); // Ensure input updates if string passed
      const res = await fetch(`/api/github?username=${query.trim()}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to find user");
      }

      const result = await res.json();
      setData(result);
      addSearch(query.trim()); // Save to global recent searches history
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

          <form onSubmit={handleSearch} className="relative group z-50">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-accent" />
            </div>
            <input
              type="text"
              placeholder="e.g. torvalds"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="block w-full pl-12 pr-32 py-4 text-lg bg-surface/50 backdrop-blur-sm border border-border shadow-sm rounded-2xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all relative z-10"
              autoComplete="off"
              spellCheck={false}
            />
            <div className="absolute inset-y-2 right-2 flex items-center z-10">
              <button 
                type="submit" 
                disabled={!username.trim() || loading}
                className="glow-button h-full px-6 rounded-xl font-medium disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? "Searching..." : "Analyze"}
              </button>
            </div>
            
            {/* Expanded Dropdown inside form layout */}
            {showDropdown && recentSearches.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-surface/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl overflow-hidden text-left animate-in fade-in slide-in-from-top-2">
                <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40 bg-black/5">
                  Recent 5 Searches
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {recentSearches.map(name => (
                    <div 
                      key={name}
                      onClick={() => {
                        setUsername(name);
                        setShowDropdown(false);
                        handleSearch(name);
                      }}
                      className="px-5 py-3.5 text-base hover:bg-accent/10 hover:text-accent cursor-pointer flex items-center transition-colors"
                    >
                      <Search className="w-4 h-4 mr-3 text-muted-foreground transition-colors" />
                      <span className="font-semibold text-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
          
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm text-center animate-fade-in relative z-0">
              {error}
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex flex-col gap-8 relative z-0">
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
          <div className="flex flex-col gap-8 animate-fade-in relative z-0">
            
            {/* Top Banner: Profile */}
            <ProfileCard 
              user={data.user} 
              badges={evaluateBadges(data.user, data.stats, data.languages, data.activity)} 
            />
            
            {/* Phase 3: Repo Stats Cards */}
            <RepoStatsCards stats={data.stats} />

            {/* Two Column Grid for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Phase 4: Activity Area Chart */}
              <ActivityChart data={data.activity} />
              
              {/* Phase 3: Language Distribution */}
              <LanguageChart data={data.languages} />
            </div>

            {/* Phase 4: 3D Cityscape Heatmap & Holographic Stats */}
            {data.contributions && (
              <div className="w-full">
                <HolographicStats data={data.contributions} />
                <CityscapeHeatmap data={data.contributions} />
              </div>
            )}

            {/* Phase 6: Collaboration Stats */}
            {data.collaboration && (
              <div className="w-full mt-2">
                <CollaborationStats data={data.collaboration} />
              </div>
            )}

            {/* AI Insights Banner */}
            <div className="w-full mt-4">
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
