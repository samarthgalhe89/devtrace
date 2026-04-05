import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchUser, fetchRepos, fetchRepoLanguages } from "@/lib/github";
import { calculateRepoStats, aggregateLanguages } from "@/lib/analytics";
import { generateVersusMatchup } from "@/lib/ai";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user1 = searchParams.get("user1");
    const user2 = searchParams.get("user2");

    if (!user1 || !user2) {
      return NextResponse.json({ error: "Both user1 and user2 usernames are required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    const fetchUserData = async (username: string) => {
      const user = await fetchUser(username, token);
      const repos = await fetchRepos(username, token);
      const stats = calculateRepoStats(repos);
      const topRepos = repos.slice(0, 30);
      const languagesPromises = topRepos.map((repo) => fetchRepoLanguages(repo.owner.login, repo.name, token));
      const reposLanguages = await Promise.all(languagesPromises);
      const languages = aggregateLanguages(reposLanguages);
      return { user, stats, languages };
    };

    const [u1Data, u2Data] = await Promise.all([
      fetchUserData(user1),
      fetchUserData(user2)
    ]);

    const matchup = await generateVersusMatchup(u1Data, u2Data);

    return NextResponse.json({ matchup });
  } catch (error: unknown) {
    console.error("Versus Matchup Error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to generate versus matchup." }, { status: 500 });
  }
}
