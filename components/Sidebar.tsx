"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Search Developers",
    href: "/dashboard/search",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: "Versus Mode",
    href: "/dashboard/versus",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
        <path d="M13 19l6 3 3-6-6-3" />
        <path d="M9.5 14.5L14 10" />
        <path d="M19.5 7L21 3h-4l-3 3" />
      </svg>
    ),
  },
];

const labsItems = [
  {
    label: "Code Graveyard",
    href: "/dashboard/graveyard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22v-2" />
        <path d="M16 22v-2" />
        <path d="M6 18h12" />
        <path d="M6 18V7a5 5 0 0 1 12 0v11" />
        <circle cx="12" cy="10" r="1" />
      </svg>
    ),
  },
  {
    label: "Arch-Nemesis",
    href: "/dashboard/nemesis",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    label: "Stress Map",
    href: "/dashboard/stress",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-background/60 backdrop-blur-xl shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img
              src="/logo.svg"
              alt="Glyph Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black gradient-text leading-none tracking-tight">
              Glyph
            </span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground/70 font-bold mt-1">
              Developer DNA
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground border border-transparent"
              }`}
            >
              <span
                className={`transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Labs Divider */}
        <div className="pt-4 pb-2 px-4">
          <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Labs</div>
        </div>

        {labsItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground border border-transparent"
              }`}
            >
              <span
                className={`transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {session?.user && (
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <Avatar className="w-8 h-8 ring-2 ring-border">
              {session.user.image && <AvatarImage src={session.user.image} alt="avatar" />}
              <AvatarFallback>{session.user.name?.slice(0, 2).toUpperCase() || "GH"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email || "GitHub User"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-xs h-9 font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-colors"
          >
            Logout
          </Button>
        </div>
      )}
    </aside>
  );
}
