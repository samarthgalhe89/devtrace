"use client";

import { useState } from "react";
import { RepoHealth } from "@/lib/scoring";

interface RepoHealthTableProps {
  data: RepoHealth[];
}

export default function RepoHealthTable({ data }: RepoHealthTableProps) {
  const [showAll, setShowAll] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <p className="text-muted-foreground">No repositories found.</p>
      </div>
    );
  }

  const displayData = showAll ? data : data.slice(0, 10);

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏥</span>
          <h3 className="text-base font-semibold text-foreground">
            Repository Health
          </h3>
        </div>
        <span className="text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded-full border border-border">
          Scores (0-100) based on engagement and recency
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-medium">
              <th className="px-6 py-4">Repository</th>
              <th className="px-6 py-4 hidden sm:table-cell">Language</th>
              <th className="px-6 py-4 text-right">Stars</th>
              <th className="px-6 py-4 text-right">Health Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayData.map((item) => (
              <tr
                key={item.repo.id}
                className="hover:bg-surface-hover/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <a
                    href={item.repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground group-hover:text-accent transition-colors"
                  >
                    {item.repo.name}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                    {item.repo.description || "No description"}
                  </p>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell whitespace-nowrap">
                  {item.repo.language ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      {item.repo.language}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap text-sm">
                  {item.repo.stargazers_count > 0 ? (
                    <span className="font-medium">
                      {item.repo.stargazers_count.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <span
                      className="font-bold text-sm"
                      style={{ color: item.color }}
                    >
                      {item.score}
                    </span>
                    <div className="w-16 h-2 bg-surface rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${item.score}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 10 && (
        <div className="p-4 border-t border-border text-center bg-surface/30">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {showAll ? "Show less" : `View all ${data.length} repositories`}
          </button>
        </div>
      )}
    </div>
  );
}
