import { GitHubUser, GitHubRepo } from "./github";
import { RepoStats, LanguageStat } from "./analytics";
import { ActivityTimelinePoint } from "./activity";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  color: string;
}

export function evaluateBadges(
  user: GitHubUser,
  stats: RepoStats,
  languages: LanguageStat[],
  activity: ActivityTimelinePoint[]
): Badge[] {
  const allBadges: Badge[] = [
    {
      id: "polyglot",
      name: "Polyglot",
      description: "Uses 5 or more programming languages extensively.",
      icon: "🌐",
      earned: languages.length >= 5,
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    {
      id: "star_gazer",
      name: "Star Gazer",
      description: "Received over 100 stars across all repositories.",
      icon: "⭐",
      earned: stats.totalStars >= 100,
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    },
    {
      id: "veteran",
      name: "Veteran",
      description: "GitHub account created over 5 years ago.",
      icon: "🕰️",
      earned: (new Date().getFullYear() - new Date(user.created_at).getFullYear()) >= 5,
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
    },
    {
      id: "prolific",
      name: "Prolific Creator",
      description: "Created over 50 public repositories.",
      icon: "📦",
      earned: user.public_repos >= 50,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    },
    {
      id: "influencer",
      name: "Influencer",
      description: "Has more than 100 followers.",
      icon: "📢",
      earned: user.followers >= 100,
      color: "bg-pink-500/10 text-pink-600 border-pink-200",
    },
    {
      id: "consistent",
      name: "Consistent",
      description: "High activity across repositories.",
      icon: "🔥",
      earned: activity.length >= 20,
      color: "bg-orange-500/10 text-orange-600 border-orange-200",
    }
  ];

  return allBadges.sort((a, b) => (a.earned === b.earned ? 0 : a.earned ? -1 : 1));
}
