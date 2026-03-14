import { GitHubRepo } from "./github";

export interface RepoStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  avgStars: number;
  mostStarred: GitHubRepo | null;
}

/**
 * Calculate aggregated statistics from a list of repositories.
 */
export function calculateRepoStats(repos: GitHubRepo[]): RepoStats {
  if (!repos || repos.length === 0) {
    return {
      totalRepos: 0,
      totalStars: 0,
      totalForks: 0,
      totalWatchers: 0,
      avgStars: 0,
      mostStarred: null,
    };
  }

  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;
  let mostStarred: GitHubRepo | null = null;

  for (const repo of repos) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    totalWatchers += repo.watchers_count;

    if (!mostStarred || repo.stargazers_count > mostStarred.stargazers_count) {
      mostStarred = repo;
    }
  }

  // If top repos are tied at 0 stars, mostStarred might just be the first one, which is fine.
  if (mostStarred && mostStarred.stargazers_count === 0) {
    mostStarred = null; // Optional: don't highlight a "most starred" if it has 0 stars
  }

  return {
    totalRepos: repos.length,
    totalStars,
    totalForks,
    totalWatchers,
    avgStars: Number((totalStars / repos.length).toFixed(1)),
    mostStarred,
  };
}

export interface LanguageStat {
  name: string;
  value: number;     // e.g., bytes
  percentage: number;
  color: string;
}

// GitHub language colors (a small curated map, fallback to random/hash)
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  Dart: "#00B4AB",
  Swift: "#ffac45",
  Kotlin: "#F18E33",
};

function getLanguageColor(language: string): string {
  if (LANGUAGE_COLORS[language]) return LANGUAGE_COLORS[language];
  // Simple hash for consistent colors
  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

/**
 * Aggregate language data from multiple repositories into percentages.
 * @param reposLanguages Array of language objects { Language: bytes }
 */
export function aggregateLanguages(
  reposLanguages: Record<string, number>[]
): LanguageStat[] {
  const totals: Record<string, number> = {};
  let totalBytes = 0;

  for (const repoLangs of reposLanguages) {
    for (const [lang, bytes] of Object.entries(repoLangs)) {
      totals[lang] = (totals[lang] || 0) + bytes;
      totalBytes += bytes;
    }
  }

  if (totalBytes === 0) return [];

  // Convert to array, calculate percentage, sort
  const stats: LanguageStat[] = Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Number(((value / totalBytes) * 100).toFixed(1)),
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.value - a.value);

  // Group tail end into "Other" if too many
  if (stats.length > 6) {
    const top5 = stats.slice(0, 5);
    const others = stats.slice(5);

    let otherBytes = 0;
    let otherPercent = 0;
    for (const o of others) {
      otherBytes += o.value;
      otherPercent += o.percentage;
    }

    top5.push({
      name: "Other",
      value: otherBytes,
      percentage: Number(otherPercent.toFixed(1)),
      color: "#6c757d", // Muted gray
    });

    return top5;
  }

  return stats;
}
