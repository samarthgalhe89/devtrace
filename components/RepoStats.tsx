import { GitHubRepo } from "@/lib/github";
import { RepoStats } from "@/lib/analytics";
import { Package, Star, GitFork, TrendingUp, Trophy } from "lucide-react";

interface RepoStatsProps {
  stats: RepoStats;
}

export default function RepoStatsCards({ stats }: RepoStatsProps) {
  const cards = [
    {
      label: "Total Repositories",
      value: stats.totalRepos.toLocaleString(),
      icon: <Package className="w-5 h-5 text-accent" />,
    },
    {
      label: "Total Stars",
      value: stats.totalStars.toLocaleString(),
      icon: <Star className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: "Total Forks",
      value: stats.totalForks.toLocaleString(),
      icon: <GitFork className="w-5 h-5 text-accent" />,
    },
    {
      label: "Avg. Stars / Repo",
      value: stats.avgStars,
      icon: <TrendingUp className="w-5 h-5 text-success" />,
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
              {card.icon}
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
        <div className="glass-card p-6 border-accent/20 bg-gradient-to-br from-card to-blue-500/5 animate-fade-in animate-fade-in-delay-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
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
                <Star className="w-3.5 h-3.5" />
                {stats.mostStarred.stargazers_count.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <GitFork className="w-3.5 h-3.5" />
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
