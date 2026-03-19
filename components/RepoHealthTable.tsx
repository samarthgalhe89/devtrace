"use client";

import { useState } from "react";
import { RepoHealth } from "@/lib/scoring";
import { HeartPulse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RepoHealthTableProps {
  data: RepoHealth[];
}

export default function RepoHealthTable({ data }: RepoHealthTableProps) {
  const [showAll, setShowAll] = useState(false);

  if (!data || data.length === 0) {
    return (
      <Card className="p-8 text-center animate-fade-in border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <p className="text-muted-foreground">No repositories found.</p>
      </Card>
    );
  }

  const displayData = showAll ? data : data.slice(0, 10);

  return (
    <Card className="overflow-hidden animate-fade-in border-border bg-white p-0">
      <CardHeader className="p-6 pb-5 border-b border-border flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-accent" />
          <CardTitle className="text-base font-semibold text-foreground">
            Repository Health
          </CardTitle>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">
          Scores (0-100) based on engagement and recency
        </span>
      </CardHeader>

      <CardContent className="p-0 px-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground font-semibold">
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
                className="hover:bg-secondary/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <a
                    href={item.repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground group-hover:text-accent transition-colors block"
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
                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden border border-border">
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

        {data.length > 10 && (
          <div className="p-4 border-t border-border text-center bg-secondary/30">
            <Button
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-accent hover:text-accent hover:bg-accent/10 transition-colors"
            >
              {showAll ? "Show less" : `View all ${data.length} repositories`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
