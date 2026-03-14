import { GitHubRepo } from "./github";

export interface ActivityTimelinePoint {
  date: string;       // e.g., "2023-01"
  updates: number;    // number of repos updated in this month
}

/**
 * Group active repositories by their Last Updated month to create an activity timeline.
 * Analyzes the last 12 months.
 */
export function calculateActivityTimeline(
  repos: GitHubRepo[]
): ActivityTimelinePoint[] {
  if (!repos || repos.length === 0) return [];

  // Get the last 12 months array for the X-axis
  const timeline: Record<string, number> = {};
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
    timeline[label] = 0;
  }

  // Count instances
  const cutoff = new Date(today.getFullYear(), today.getMonth() - 11, 1).getTime(); // 12 months ago
  
  for (const repo of repos) {
    const updatedMs = new Date(repo.updated_at).getTime();
    if (updatedMs >= cutoff) {
      const d = new Date(repo.updated_at);
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (timeline[label] !== undefined) {
        timeline[label]++;
      }
    }
  }

  // Map to array
  return Object.entries(timeline).map(([date, updates]) => {
    // Format label to short month (e.g., "Jan 24")
    const d = new Date(date + "-01");
    const formatted = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    
    return {
      date: formatted,
      updates,
    };
  });
}
