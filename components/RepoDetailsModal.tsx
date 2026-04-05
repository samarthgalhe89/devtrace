"use client";

import { X, Star, GitFork, Eye, CircleDot, Code2, Clock, HardDrive, Tag } from "lucide-react";
import { GitHubRepo } from "@/lib/github";

interface RepoDetailsModalProps {
  repo: GitHubRepo | null;
  onClose: () => void;
}

export default function RepoDetailsModal({ repo, onClose }: RepoDetailsModalProps) {
  if (!repo) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl overflow-hidden bg-card border shadow-2xl border-border rounded-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b bg-secondary/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                {repo.name}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground ml-7">
              {repo.description || "No description provided."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col items-center justify-center p-4 bg-secondary/40 rounded-xl border border-border/50">
              <Star className="w-5 h-5 text-yellow-500 mb-2" />
              <span className="text-lg font-bold text-foreground">{repo.stargazers_count.toLocaleString()}</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Stars</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-secondary/40 rounded-xl border border-border/50">
              <GitFork className="w-5 h-5 text-blue-500 mb-2" />
              <span className="text-lg font-bold text-foreground">{repo.forks_count.toLocaleString()}</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Forks</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-secondary/40 rounded-xl border border-border/50">
              <Eye className="w-5 h-5 text-purple-500 mb-2" />
              <span className="text-lg font-bold text-foreground">{repo.watchers_count.toLocaleString()}</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Watchers</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-secondary/40 rounded-xl border border-border/50">
              <CircleDot className="w-5 h-5 text-emerald-500 mb-2" />
              <span className="text-lg font-bold text-foreground">{repo.open_issues_count.toLocaleString()}</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Issues</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border pb-2">Repository Details</h3>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Main Language</p>
                  <p className="font-semibold text-foreground">{repo.language || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <HardDrive className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="font-semibold text-foreground">{(repo.size / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border pb-2">Timeline</h3>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-semibold text-foreground">{formatDate(repo.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Pushed</p>
                  <p className="font-semibold text-foreground">{formatDate(repo.pushed_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {repo.topics && repo.topics.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border pb-2 mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {repo.topics.map(topic => (
                  <span key={topic} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 text-xs font-medium text-muted-foreground border border-border">
                    <Tag className="w-3 h-3" /> {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/10 flex justify-end">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-foreground text-background text-sm font-bold shadow-md hover:scale-105 transition-transform"
          >
            Open in GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
