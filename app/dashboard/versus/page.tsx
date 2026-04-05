"use client";

import { useState, useEffect } from "react";
import { Search, Swords, Users, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useGlobalState } from "@/components/GlobalStateProvider";
import { Sparkles, Crown } from "lucide-react";
import VersusLanguageChart from "@/components/VersusLanguageChart";
import { VersusMatchup } from "@/lib/ai";

interface VersusData {
  user: any;
  stats: any;
}

const getWinner = (val1: number, val2: number, data1: VersusData | null, data2: VersusData | null) => {
  if (!data1 || !data2) return null;
  if (val1 > val2) return "user1";
  if (val2 > val1) return "user2";
  return "draw";
};

const StatRow = ({ label, val1, val2, data1, data2, suffix = "" }: { label: string, val1: number, val2: number, data1: VersusData | null, data2: VersusData | null, suffix?: string }) => {
  const winner = getWinner(val1, val2, data1, data2);
  return (
    <div className="flex flex-col gap-2 py-4 border-b border-border last:border-0 px-4">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">{label}</div>
      <div className="flex items-center justify-between gap-4">
        <div className={`flex-1 text-center text-lg font-bold ${winner === "user1" ? "text-blue-600 scale-110" : "text-foreground opacity-50"} transition-all`}>
          {val1?.toLocaleString()}{suffix}
        </div>
        <div className="px-2 py-0.5 rounded bg-secondary text-[10px] font-bold">VS</div>
        <div className={`flex-1 text-center text-lg font-bold ${winner === "user2" ? "text-blue-600 scale-110" : "text-foreground opacity-50"} transition-all`}>
          {val2?.toLocaleString()}{suffix}
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ data, loading, search, setSearch, onSearch, recentSearches }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Card className="flex-1 bg-surface/50 backdrop-blur-sm border-border shadow-sm overflow-visible min-h-[500px]">
      <CardHeader className="p-6 border-b bg-secondary/30 relative z-20">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="GitHub Username" 
              className="pl-10 h-10 bg-transparent"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  onSearch(search);
                  setShowDropdown(false);
                  e.currentTarget.blur();
                }
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {showDropdown && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface/95 backdrop-blur-md border border-border rounded-xl shadow-xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary/20 border-b border-border/50">
                  Recent 5 Searches
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {recentSearches.map((name: string) => (
                    <div 
                      key={name}
                      onClick={() => {
                        setSearch(name);
                        setShowDropdown(false);
                        onSearch(name);
                      }}
                      className="px-4 py-3 text-sm hover:bg-accent/10 hover:text-accent cursor-pointer flex items-center transition-colors"
                    >
                      <Search className="w-4 h-4 mr-3 text-muted-foreground transition-colors" />
                      <span className="font-semibold text-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button onClick={() => {
            onSearch(search);
            setShowDropdown(false);
          }} disabled={loading || !search} size="icon" className="hover:scale-105 transition-transform flex-shrink-0">
            <Swords className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 animate-pulse pt-12">
            <div className="w-24 h-24 rounded-full bg-secondary" />
            <div className="h-6 w-32 bg-secondary rounded" />
            <div className="h-4 w-48 bg-secondary rounded" />
          </div>
        ) : data?.user ? (
          <div className="flex flex-col items-center pt-8">
            <Avatar className="w-24 h-24 ring-4 ring-secondary mb-4">
              <AvatarImage src={data.user.avatar_url} />
              <AvatarFallback>{data.user.login?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold text-foreground mb-1 text-center">{data.user.name || data.user.login}</h3>
            <p className="text-sm text-blue-600 font-medium mb-6">@{data.user.login}</p>
            
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/20 rounded-xl border border-border/50 text-center">
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Followers</div>
                <div className="text-lg font-bold">{data.user.followers?.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-secondary/20 rounded-xl border border-border/50 text-center">
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Public Repos</div>
                <div className="text-lg font-bold">{data.user.public_repos?.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center opacity-40">
            <Users className="w-12 h-12 mb-4" />
            <p className="text-sm font-medium">Search for a developer</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function VersusPage() {
  const {
    versusUser1Search: user1Search, setVersusUser1Search: setUser1Search,
    versusData1: data1, setVersusData1: setData1,
    versusUser2Search: user2Search, setVersusUser2Search: setUser2Search,
    versusData2: data2, setVersusData2: setData2
  } = useGlobalState();

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  
  const [matchupData, setMatchupData] = useState<VersusMatchup | null>(null);
  const [matchupLoading, setMatchupLoading] = useState(false);
  const [lastMatchupPair, setLastMatchupPair] = useState("");

  const { addSearch, recentSearches } = useRecentSearches("versus");

  useEffect(() => {
    if (data1?.user?.login && data2?.user?.login) {
      const pair = `${data1.user.login}-${data2.user.login}`;
      if (lastMatchupPair !== pair) {
        setLastMatchupPair(pair);
        setMatchupData(null);
        setMatchupLoading(true);
        fetch(`/api/analyze-versus?user1=${data1.user.login}&user2=${data2.user.login}`)
          .then(res => res.json())
          .then(data => {
            if (data.matchup) setMatchupData(data.matchup);
          })
          .catch(err => console.error("Matchup error", err))
          .finally(() => setMatchupLoading(false));
      }
    } else {
      setMatchupData(null);
      setLastMatchupPair("");
    }
  }, [data1?.user?.login, data2?.user?.login, lastMatchupPair]);

  const fetchUser = async (username: string, setFn: (d: any) => void, setLoading: (l: boolean) => void) => {
    if (!username) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/github?username=${username}`);
      if (!res.ok) throw new Error("User not found");
      const result = await res.json();
      setFn(result);
      addSearch(username);
      
    } catch (err) {
      console.error(err);
      setFn(null); // Clear previous data on error
    } finally {
      setLoading(false);
    }
  };

  const [hasAutoFetched, setHasAutoFetched] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasAutoFetched) {
      const params = new URLSearchParams(window.location.search);
      const autoUser1 = params.get("user1");
      const autoUser2 = params.get("user2");

      if (autoUser1 && autoUser2) {
        setHasAutoFetched(true);
        setUser1Search(autoUser1);
        setUser2Search(autoUser2);
        
        // Force clear any old cached analytics completely
        setData1(null);
        setData2(null);
        
        // Automatically fetch the new matchup
        fetchUser(autoUser1, setData1, setLoading1);
        fetchUser(autoUser2, setData2, setLoading2);
        
        // Strip the URL parameters to prevent an infinite auto-fetch loop on reload
        window.history.replaceState({}, '', '/dashboard/versus');
      } else {
        setHasAutoFetched(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAutoFetched]);

  const handleVersusSearch = () => {
    if (user1Search) {
      fetchUser(user1Search, setData1, setLoading1);
    }
    if (user2Search) {
      fetchUser(user2Search, setData2, setLoading2);
    }
  };

  return (
    <div className="min-h-screen grid-bg p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:translate-x-[-2px] transition-transform flex-shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                <Swords className="w-8 h-8 text-blue-600" /> Versus Mode
              </h1>
              <p className="text-muted-foreground font-medium">Side-by-side developer intelligence battle.</p>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row items-stretch gap-8 mb-8">
          <UserCard 
            data={data1} 
            loading={loading1} 
            search={user1Search} 
            setSearch={setUser1Search} 
            onSearch={(term: string) => fetchUser(term || user1Search, setData1, setLoading1)} 
            recentSearches={recentSearches}
          />
          
          <div className="hidden lg:flex flex-col justify-center relative z-0">
            <Button 
                onClick={handleVersusSearch}
                className="w-12 h-12 rounded-full p-0 bg-primary flex items-center justify-center shadow-xl shadow-primary/20 z-10 border-4 border-white hover:scale-110 transition-all cursor-pointer flex-shrink-0"
                disabled={(!user1Search && !user2Search) || (loading1 || loading2)}
            >
              <Swords className="w-6 h-6 text-white" />
            </Button>
          </div>

          <UserCard 
            data={data2} 
            loading={loading2} 
            search={user2Search} 
            setSearch={setUser2Search} 
            onSearch={(term: string) => fetchUser(term || user2Search, setData2, setLoading2)} 
            recentSearches={recentSearches}
          />
        </div>

        {data1?.user && data2?.user && data1?.stats && data2?.stats && (
          <Card className="bg-surface/50 backdrop-blur-sm border-border shadow-sm animate-fade-in relative z-0">
            <CardHeader className="p-6 border-b text-center">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Battle Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-w-xl mx-auto py-4">
                <StatRow label="Stars Received" val1={data1.stats.totalStars} val2={data2.stats.totalStars} data1={data1} data2={data2} />
                <StatRow label="Forks Accumulated" val1={data1.stats.totalForks} val2={data2.stats.totalForks} data1={data1} data2={data2} />
                <StatRow label="Followers" val1={data1.user.followers} val2={data2.user.followers} data1={data1} data2={data2} />
                <StatRow label="Public Repositories" val1={data1.user.public_repos} val2={data2.user.public_repos} data1={data1} data2={data2} />
              </div>
            </CardContent>
          </Card>
        )}

        {data1?.user && data2?.user && data1?.languages && data2?.languages && (
           <VersusLanguageChart 
              user1Name={data1.user.login} 
              user2Name={data2.user.login} 
              languages1={data1.languages} 
              languages2={data2.languages} 
           />
        )}

        {/* AI Matchup Section */}
        {data1?.user && data2?.user && (
          <Card className="bg-surface/50 backdrop-blur-sm border-border shadow-sm mt-8 animate-fade-in relative z-0 overflow-hidden">
            <CardHeader className="p-6 border-b bg-slate-900 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> AI Judge Matchup
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {matchupLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 animate-pulse py-8">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="h-6 w-48 bg-muted rounded" />
                  <div className="h-4 w-64 bg-muted rounded" />
                </div>
              ) : matchupData ? (
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-200 shadow-sm">
                    <Crown className="w-4 h-4" /> Winner: {matchupData.winner}
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4">{matchupData.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 font-medium">
                    {matchupData.analysis}
                  </p>
                  <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Final Verdict</div>
                    <div className="font-bold text-foreground">{matchupData.verdict}</div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
