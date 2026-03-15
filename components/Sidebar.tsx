"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

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
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-background/60 backdrop-blur-xl shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-1">
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <img
              src="/logo.svg"
              alt="GitHub Intelligence Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-base font-bold gradient-text leading-tight">
            GitHub<br />Intelligence
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
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
                  ? "bg-accent/10 text-white border border-accent/20"
                  : "text-white/80 hover:bg-surface-hover hover:text-white border border-transparent"
              }`}
            >
              <span
                className={`transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-muted-foreground group-hover:text-white"
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
            {session.user.image && (
              <img
                src={session.user.image}
                alt="avatar"
                className="w-8 h-8 rounded-full ring-2 ring-border"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email || "GitHub User"}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-xs font-medium text-muted-foreground hover:text-danger hover:bg-danger/10 hover:border-danger/50 transition-colors px-3 py-2 rounded-lg border border-border bg-surface text-center"
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
