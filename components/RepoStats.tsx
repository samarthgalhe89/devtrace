import { GitHubRepo } from "@/lib/github";
import { RepoStats } from "@/lib/analytics";

interface RepoStatsProps {
  stats: RepoStats;
}

export default function RepoStatsCards({ stats }: RepoStatsProps) {
  const cards = [
    {
      label: "Total Repositories",
      value: stats.totalRepos.toLocaleString(),
      icon: "📦",
    },
    {
      label: "Total Stars",
      value: stats.totalStars.toLocaleString(),
      icon: "⭐",
    },
    {
      label: "Total Forks",
      value: stats.totalForks.toLocaleString(),
      icon: "🔗",
    },
    {
      label: "Avg. Stars / Repo",
      value: stats.avgStars,
      icon: "📈",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Grid Cards */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, idx) => (
          <div
            key={card.label}
            className={`glass-card p-5 animate-fade-in`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{card.icon}</span>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {card.label}
              </h3>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Most Starred Repo Hero Card */}
      {stats.mostStarred && (
        <div className="glass-card p-6 border-accent/20 bg-gradient-to-br from-card to-accent/5 animate-fade-in animate-fade-in-delay-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Most Starred Repository
              </h3>
            </div>
          </div>
          <a
            href={stats.mostStarred.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <h4 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-2">
              {stats.mostStarred.name}
            </h4>
            {stats.mostStarred.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {stats.mostStarred.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-yellow-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {stats.mostStarred.stargazers_count.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L12 2 6 6M12 2v20"/>
                </svg>
                {stats.mostStarred.forks_count.toLocaleString()}
              </span>
              {stats.mostStarred.language && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {stats.mostStarred.language}
                </span>
              )}
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
