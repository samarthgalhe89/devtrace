"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { GlobalStateProvider } from "@/components/GlobalStateProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to homepage if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // While checking auth, show a loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen grid-bg flex">
      <Sidebar />

      {/* Mobile Header (shown on small screens only) */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full">
        <header className="lg:hidden border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/80 backdrop-blur-md sticky top-0 z-50 w-full">
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.svg"
              alt="Logo"
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-bold gradient-text">DevDNA</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-hide sm:pb-0">
            <a
              href="/dashboard"
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                pathname === "/dashboard"
                  ? "border-accent/20 bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </a>
            <a
              href="/dashboard/search"
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                pathname.startsWith("/dashboard/search")
                  ? "border-accent/20 bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Search
            </a>
            <a
              href="/dashboard/versus"
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                pathname.startsWith("/dashboard/versus")
                  ? "border-accent/20 bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Versus
            </a>
            <a
              href="/dashboard/graveyard"
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                pathname.startsWith("/dashboard/graveyard")
                  ? "border-accent/20 bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Graveyard
            </a>
            <a
              href="/dashboard/nemesis"
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                pathname.startsWith("/dashboard/nemesis")
                  ? "border-accent/20 bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Nemesis
            </a>
            <a
              href="/dashboard/stress"
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                pathname.startsWith("/dashboard/stress")
                  ? "border-accent/20 bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Stress
            </a>
          </div>
        </header>

        <GlobalStateProvider>
          <main className="flex-1 w-full min-w-0 overflow-x-hidden">{children}</main>
        </GlobalStateProvider>
      </div>
    </div>
  );
}
