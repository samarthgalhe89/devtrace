import { GitHubUser } from "@/lib/github";
import { FolderGit2, Users, UserCheck, MapPin, Building2, CalendarDays, ExternalLink, Share, Download } from "lucide-react";
import { exportAsImage } from "@/lib/exportImage";
import { toast } from "sonner"; // Assuming sonner is used for toasts, otherwise I'll use a fallback
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BadgesDisplay from "@/components/BadgesDisplay";
import { Badge } from "@/lib/badges";

interface ProfileCardProps {
  user: GitHubUser;
  badges?: Badge[];
}

export default function ProfileCard({ user, badges }: ProfileCardProps) {
  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const stats = [
    { label: "Repositories", value: user.public_repos, icon: <FolderGit2 className="w-5 h-5 text-accent" /> },
    { label: "Followers", value: user.followers, icon: <Users className="w-5 h-5 text-accent" /> },
    { label: "Following", value: user.following, icon: <UserCheck className="w-5 h-5 text-accent" /> },
  ];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied to clipboard!", {
      description: "You can now share it with others.",
      icon: <Share className="w-4 h-4" />,
    });
  };

  return (
    <Card id="profile-card" className="w-full animate-fade-in border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <CardContent className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8">
          
          {/* Left Side: Avatar + Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 flex-1 text-center sm:text-left min-w-0 w-full">
            {/* Avatar with Hover Link */}
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative shrink-0 group block"
              title="View Profile on GitHub"
            >
              <Avatar className="w-24 h-24 lg:w-28 lg:h-28 ring-2 ring-border ring-offset-2 ring-offset-background transition-all group-hover:ring-accent">
                <AvatarImage src={user.avatar_url} alt={`${user.login}'s avatar`} crossOrigin="anonymous" />
                <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full z-10">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 bg-success rounded-full border-2 border-background z-20" />
            </a>

            {/* Info */}
            <div className="flex-1 min-w-0 w-full">
              <h2 className="text-2xl font-bold text-foreground break-words">
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <span>@{user.login}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>

              {user.bio && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg mx-auto sm:mx-0 break-words">
                  {user.bio}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mt-4 justify-center sm:justify-start">
                {user.location && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {user.location}
                  </span>
                )}
                {user.company && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    {user.company}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Joined {joinedDate}
                </span>
              </div>
              
              {badges && badges.length > 0 && (
                <div className="mt-6 flex justify-center sm:justify-start">
                  <BadgesDisplay badges={badges} />
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Stats bar + Share */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-6 lg:gap-10 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border lg:pl-10 w-full lg:w-auto justify-center sm:justify-start">
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="group-hover:scale-110 transition-transform">{s.icon}</span>
                    <p className="text-2xl font-bold text-foreground">
                      {s.value.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{s.label}</p>
                </div>
              ))}
            </div>
            
            <div className="h-10 w-px bg-border hidden sm:block mx-2" />
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => exportAsImage("profile-card", `${user.login}-profile`)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-secondary/80 text-foreground hover:bg-secondary text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all outline outline-1 outline-border w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <Share className="w-4 h-4" />
                Share Profile
              </button>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
