import { GitHubRepo } from "./github";

export interface RepoHealth {
  repo: GitHubRepo;
  score: number;       // 0-100
  color: string;       // success/warning/danger
  metrics: {
    starsCore: number;
    forksCore: number;
    recencyBonus: number;
    issuesPenalty: number;
  };
}

/**
 * Calculate a health score for a single repository.
 * Based on stars, forks, recency of updates, and open issues.
 */
export function calculateHealthScore(repo: GitHubRepo): RepoHealth {
  // Base metrics
  const starsCore = Math.min(repo.stargazers_count * 2, 40); // Max 40 pts from stars (20 stars needed)
  const forksCore = Math.min(repo.forks_count * 3, 30);      // Max 30 pts from forks (10 forks needed)

  // Recency bonus: max 30 pts if updated in last 30 days, degrades to 0 over 2 years
  const daysSinceUpdate =
    (new Date().getTime() - new Date(repo.updated_at).getTime()) /
    (1000 * 3600 * 24);
  
  let recencyBonus = 0;
  if (daysSinceUpdate <= 30) {
    recencyBonus = 30;
  } else if (daysSinceUpdate <= 365) {
    // Linear degradation from 30 days to 365 days (max 20 pts)
    recencyBonus = 20 - ((daysSinceUpdate - 30) / 335) * 20;
  } else if (daysSinceUpdate <= 730) {
    // Linear degradation from 1 yr to 2 yrs (max 10 pts)
    recencyBonus = 10 - ((daysSinceUpdate - 365) / 365) * 10;
  }

  // Issues penalty: -1 pt per open issue, max -10
  const issuesPenalty = Math.max(repo.open_issues_count * -1, -10);

  // Total
  let score = Math.round(starsCore + forksCore + recencyBonus + issuesPenalty);
  
  // Constrain 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine color map
  let color = "var(--color-danger)"; // red
  if (score >= 75) {
    color = "var(--color-success)"; // green
  } else if (score >= 40) {
    color = "var(--color-warning)"; // yellow
  }

  return {
    repo,
    score,
    color,
    metrics: {
      starsCore: Math.round(starsCore),
      forksCore: Math.round(forksCore),
      recencyBonus: Math.round(recencyBonus),
      issuesPenalty,
    },
  };
}

/**
 * Generate health scores for all repos and sort by score descending.
 */
export function calculateAllHealthScores(repos: GitHubRepo[]): RepoHealth[] {
  return repos
    .filter((r) => !r.fork) // typically we only score their original work, not forks
    .map(calculateHealthScore)
    .sort((a, b) => b.score - a.score);
}
