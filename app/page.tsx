"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Github, ChevronRight, BarChart3, Dna, HeartPulse, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Dna className="w-6 h-6 text-accent" />,
    title: "AI DNA Profiling",
    description: "Categorizes developers into technical archetypes based on commit frequency, language distribution, and pattern consistency.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-accent" />,
    title: "Repository Auditing",
    description: "Evaluates project health using weighted metrics for engagement, activity recency, and codebase entropy.",
  },
  {
    icon: <Github className="w-6 h-6 text-accent" />,
    title: "Versus Mode",
    description: "Direct side-by-side comparison of two developers' contribution velocity, impact, and technical breadth.",
  },
  {
    icon: <Bot className="w-6 h-6 text-accent" />,
    title: "Engineering Labs",
    description: "Access specialized modules like the Code Graveyard for legacy projects and the Stress Map for workload analysis.",
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
    <main className="min-h-screen bg-background flex flex-col font-sans text-foreground selection:bg-accent/20 pb-24 overflow-x-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-accent-glow rounded-full blur-[140px] opacity-20 pointer-events-none" />

      {/* Hero Container */}
      <div className="flex flex-col items-center justify-center px-4 relative z-10 pt-24 pb-24">
        
        {/* Highlighted App Name */}
        <div className="animate-fade-in flex flex-col items-center gap-4 mb-10">
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/logo.svg" alt="Logo" width={64} height={64} className="w-full h-full object-contain" />
          </div>
          <span className="text-3xl font-black tracking-tight text-foreground gradient-text">DevTrace</span>
        </div>

        {/* Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs text-muted-foreground transition-colors cursor-default mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          v1.0 - GitHub Intelligence <ChevronRight className="w-3 h-3" />
        </div>

        {/* Title */}
        <h1 className="animate-fade-in animate-fade-in-delay-1 text-center font-black tracking-tighter mb-8 px-4" style={{ fontSize: "clamp(1.8rem, 5vw, 3.8rem)", lineHeight: 1.1 }}>
          Trace your <span className="gradient-text">developer DNA.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in animate-fade-in-delay-2 text-muted-foreground text-center max-w-2xl text-base md:text-lg mb-10 leading-relaxed opacity-90">
          Advanced GitHub analytics and engineering intelligence. Audit repository health, discover developer archetypes, and visualize your coding journey.
        </p>

        {/* Buttons Row */}
        <div className="animate-fade-in animate-fade-in-delay-3 flex items-center justify-center mb-16">
          <Button 
            onClick={handleLogin}
            disabled={status === "loading"}
            className="flex items-center gap-2.5 bg-[#238636] hover:bg-[#2ea043] text-white px-8 py-6 rounded-lg text-sm font-semibold cursor-pointer border-none"
          >
            <Github className="w-5 h-5" />
            Login with GitHub
          </Button>
        </div>

        {/* Terminal Mockup Footer */}
        <div className="animate-fade-in animate-fade-in-delay-4 w-full max-w-4xl mx-auto px-4">
          <div className="w-full bg-[#0d1117] border border-border/80 rounded-2xl relative overflow-hidden flex flex-col shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8),0_0_20px_rgba(88,166,255,0.05)]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/80 tracking-widest uppercase">
                <span className="w-1 h-1 rounded-full bg-green-500/50 animate-pulse" />
                bash — devtrace — 80x24
              </div>
            </div>
            {/* Terminal Body */}
            <div className="p-8 font-mono text-[13px] leading-relaxed text-[#c9d1d9] flex-1 min-h-[220px]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#58a6ff] font-bold">➜</span>
                <span className="text-[#79c0ff]">~</span>
                <span className="text-white">npx devtrace <span className="text-[#ff7b72]">analyze</span> torvalds</span>
              </div>
              <div className="text-muted-foreground/80 mb-6 flex flex-col gap-1 pl-6 border-l border-white/5">
                <div>[SYSTEM] Fetching public repositories... <span className="text-green-400">[0.42s]</span></div>
                <div>[SYSTEM] Analyzing coding patterns & activity... <span className="text-green-400">[OK]</span></div>
                <div>[SYSTEM] Building developer profile...</div>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <span className="px-1.5 py-0.5 rounded-sm bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">TYPE</span>
                  <span className="text-[#c9d1d9]">DEV TYPE: <span className="text-[#d2a8ff] font-bold">SYSTEMS ARCHITECT</span></span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-1.5 py-0.5 rounded-sm bg-yellow-500/10 text-yellow-400 text-[10px] font-bold border border-yellow-500/20">HP</span>
                  <span className="text-[#c9d1d9]">OVERALL HEALTH: <span className="text-yellow-400 font-bold">98 / 100 [A+]</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 border-t border-border/50">
        <div className="text-center mb-16 space-y-4">
          <h4 className="text-[10px] font-black text-accent tracking-[0.4em] uppercase">Modules</h4>
          <h2 className="text-3xl font-bold tracking-tight">Core Capabilities</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto opacity-70">
            A precision-engineered toolset designed to decode developer behavior and repository health using high-frequency GitHub data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className={`animate-fade-in animate-fade-in-delay-${i+1} border-border/50 bg-surface/30 backdrop-blur-sm hover:bg-surface/50 transition-all hover:-translate-y-1 group`}
            >
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed opacity-80">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
    </main>
  );
}
