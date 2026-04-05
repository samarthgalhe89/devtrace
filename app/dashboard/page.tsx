"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
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

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const { dashboardData: data, setDashboardData: setData } = useGlobalState();
  
  // If we already have data in global state, start loading as false
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);

  // Redirect to homepage if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch GitHub data when session is available
  useEffect(() => {
    if (status !== "authenticated") return;
    if (data) return; // Skip fetch if we already have global state data!

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/github");
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch data");
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

    fetchData();
  }, [status]);

  // Loading states
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen grid-bg">
        <header className="border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="skeleton w-32 h-5" />
          <div className="skeleton w-24 h-5" />
        </header>
        <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md animate-fade-in">
          <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="glow-button text-sm px-5 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const badges = evaluateBadges(data.user, data.stats, data.languages, data.activity);

  return (
    <div className="min-h-screen grid-bg">
      {/* Main content */}
      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          
          {/* Top Banner: Profile */}
          <ProfileCard user={data.user} badges={badges} />
          
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
            <DeveloperDNAComponent />
          </div>

          {/* Bottom Full Width Section */}
          <div className="w-full mt-2">
            {/* Phase 4: Repository Health Table */}
            <RepoHealthTable data={data.healthScores} />
          </div>

        </div>
      </main>
    </div>
  );
}
