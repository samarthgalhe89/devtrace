"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Github, Search, ChevronRight, BarChart3, Dna, HeartPulse, Bot } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <BarChart3 className="w-6 h-6 text-accent" />,
    title: "Profile Analytics",
    description: "Deep dive into any developer's GitHub presence and activity.",
  },
  {
    icon: <Dna className="w-6 h-6 text-accent" />,
    title: "Developer DNA",
    description: "Discover developer type, consistency, and tech diversity.",
  },
  {
    icon: <HeartPulse className="w-6 h-6 text-accent" />,
    title: "Repo Health Score",
    description: "Score each repository based on stars, forks, and activity.",
  },
  {
    icon: <Bot className="w-6 h-6 text-accent" />,
    title: "AI Insights",
    description: "Get AI-generated analysis of any developer's profile.",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col font-sans text-foreground selection:bg-accent/20 pb-20">
      
      {/* Subtle background glow mimicking the reference */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-accent-glow rounded-full blur-[120px] opacity-30 pointer-events-none" />

      {/* Top Navigation */}
      <header className="flex items-center px-6 py-4 relative z-20">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 flex items-center justify-center shrink-0 translate-y-[1px]">
            <img src="/logo.svg" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground/90">github-intelligence</span>
        </div>
      </header>

      {/* Hero Container - Takes up minimum of one screen height */}
      <div className="flex flex-col items-center justify-center px-4 relative z-10 min-h-[85vh]">
        
        {/* Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs text-muted-foreground transition-colors cursor-default mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          v1.0 - Open Source Intelligence <ChevronRight className="w-3 h-3" />
        </div>

        {/* Title */}
        <h1 className="animate-fade-in animate-fade-in-delay-1 text-center font-bold tracking-tight mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.1 }}>
          Your GitHub profile's health<br />report, in one dashboard
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in animate-fade-in-delay-2 text-muted-foreground text-center max-w-2xl text-base md:text-lg mb-10 leading-relaxed">
          github-intelligence analyzes developer profiles for language distribution, repository health, code consistency, and AI-powered archetype profiling — scored 0 to 100.
        </p>

        {/* Buttons Row */}
        <div className="animate-fade-in animate-fade-in-delay-3 flex items-center justify-center mb-16">
          <button 
            onClick={handleLogin}
            disabled={status === "loading"}
            className="btn-github flex items-center gap-2.5 bg-[#238636] hover:bg-[#2ea043] text-white px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer"
          >
            <Github className="w-5 h-5" />
            Login with GitHub
          </button>
        </div>

        {/* Terminal Mockup Footer */}
        <div className="animate-fade-in animate-fade-in-delay-4 w-full max-w-4xl mx-auto flex-shrink-0 shadow-[0_0_50px_-12px_rgba(88,166,255,0.1)]">
          <div className="w-full bg-[#1e1e1e] border border-border/80 rounded-xl relative overflow-hidden flex flex-col">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-[#252526]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">github-intelligence — analyze</span>
            </div>
            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm text-[#cccccc] flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">npx github-intelligence analyze torvalds</span>
              </div>
              <div className="text-muted-foreground mb-4">Fetching public repositories... [OK]</div>
              <div className="text-muted-foreground mb-2">Analyzing 45 repositories...</div>
              <div className="flex gap-4 mb-2">
                <span className="text-purple-400">⚡ Developer DNA:</span>
                <span className="text-white">The Systems Architect</span>
              </div>
              <div className="flex gap-4">
                <span className="text-yellow-400">✦ Overall Health:</span>
                <span className="text-white">98 / 100 (A+)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards below the fold */}
      <div className="animate-fade-in animate-fade-in-delay-4 relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-5xl mx-auto w-full px-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass-card p-6 flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform"
          >
            <div className="p-3 rounded-lg bg-surface border border-border">
              {f.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {f.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
    </main>
  );
}
