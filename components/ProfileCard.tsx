import { GitHubUser } from "@/lib/github";
import Image from "next/image";

interface ProfileCardProps {
  user: GitHubUser;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const stats = [
    { label: "Repositories", value: user.public_repos, icon: "📦" },
    { label: "Followers", value: user.followers, icon: "👥" },
    { label: "Following", value: user.following, icon: "👤" },
  ];

  return (
    <div className="glass-card p-6 lg:p-8 animate-fade-in w-full">
      <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8">
        
        {/* Left Side: Avatar + Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 flex-1 text-center sm:text-left">
          {/* Avatar with Hover Link */}
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative shrink-0 group block"
            title="View Profile on GitHub"
          >
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden ring-2 ring-accent/30 ring-offset-2 ring-offset-background transition-all group-hover:ring-accent">
              <Image
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                width={112}
                height={112}
                className="object-cover transition-transform duration-300 group-hover:scale-110 w-full h-full"
                priority
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 bg-success rounded-full border-2 border-background" />
          </a>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">
              {user.name || user.login}
            </h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              @{user.login}
            </a>

            {user.bio && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg mx-auto sm:mx-0">
                {user.bio}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-4 justify-center sm:justify-start">
              {user.location && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {user.location}
                </span>
              )}
              {user.company && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                  {user.company}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Stats bar */}
        <div className="flex items-center gap-6 lg:gap-10 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border lg:pl-10 w-full lg:w-auto justify-center sm:justify-start">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center group"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xl group-hover:scale-110 transition-transform">{s.icon}</span>
                <p className="text-2xl font-bold text-foreground">
                  {s.value.toLocaleString()}
                </p>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
