import { Groq } from "groq-sdk";
import { GitHubRepo, GitHubUser } from "@/lib/github";
import { RepoStats, LanguageStat } from "@/lib/analytics";

export interface DeveloperDNA {
  archetype: string;
  summary: string;
  strengths: string[];
  growthAreas: string[];
  personality: string[];
  careerRoadmap: string[];
}

export interface VersusMatchup {
  winner: string;
  title: string;
  analysis: string;
  verdict: string;
}

// Fallback in case of API failure or missing key
export const placeholderDNA: DeveloperDNA = {
  archetype: "Unknown Entity",
  summary: "We couldn't generate your intelligent profile at this time. Please ensure the GROQ_API_KEY is configured correctly.",
  strengths: ["Code Implementation", "Problem Solving"],
  growthAreas: ["Portfolio Expansion", "Advanced Frameworks"],
  personality: ["Determined", "Methodical"],
  careerRoadmap: ["Next.js Deep Dive", "Cloud Architecture"],
};

export async function generateDeveloperDNA(
  user: GitHubUser,
  repos: GitHubRepo[],
  stats: RepoStats,
  languages: LanguageStat[]
): Promise<DeveloperDNA> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY is missing. Returning placeholder DNA.");
    return placeholderDNA;
  }

  try {
    const groq = new Groq({ apiKey });

    // Prepare a condensed prompt to save tokens
    const prompt = `
      You are an expert engineering manager profiling a software developer based on their public GitHub data. 
      Analyze the following data and return a JSON object containing their "Developer DNA".
      
      Developer Name: ${user.name || user.login}
      Bio: ${user.bio || "No bio provided"}
      Public Repos: ${user.public_repos}
      Followers: ${user.followers}
      
      Total Stars: ${stats.totalStars}
      Total Forks: ${stats.totalForks}
      
      Top Languages (by byte size):
      ${languages.slice(0, 5).map(l => `${l.name}: ${l.percentage}%`).join("\n")}
      
      Recent Repositories:
      ${repos.slice(0, 5).map(r => `- ${r.name}: ${r.description || "N/A"} (${r.language})`).join("\n")}

      Based on this data, provide a JSON response with exactly this structure, nothing else:
      {
        "archetype": "A creative title representing their coding style (e.g., 'The Full-Stack Polyglot')",
        "summary": "A highly detailed summary of their experience (4-6 sentences long). Analyze what their work says about them.",
        "strengths": ["3 specific technical strengths"],
        "growthAreas": ["2 realistic areas they could explore"],
        "personality": ["2-3 personality traits like 'The Perfectionist', 'The Pioneer', 'The Collaborator'"],
        "careerRoadmap": ["3 specific technologies or skills they should learn next to grow"]
      }
    `;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    let text = result.choices[0]?.message?.content || "";

    // Clean up Markdown formatting if the model still accidentally prepends it
    text = text.replace(/```json\n/g, "").replace(/```/g, "").trim();

    const dna = JSON.parse(text) as DeveloperDNA;
    return dna;
  } catch (error: any) {
    if (error?.status === 429) {
      console.warn("Groq API Rate Limit reached (429). Generating fallback placeholder.");
      return {
        ...placeholderDNA,
        archetype: "Rate Limited",
        summary: "You've sent too many requests to the AI API. Please wait a minute before trying again."
      };
    }
    console.error("Error generating developer DNA with Groq:", error);
    return placeholderDNA;
  }
}

export async function generateVersusMatchup(
  user1Data: any, // { user, stats, languages }
  user2Data: any
): Promise<VersusMatchup> {
  const apiKey = process.env.GROQ_API_KEY;
  const fallback = {
    winner: "Draw",
    title: "Battle Interrupted",
    analysis: "The AI analysis is currently unavailable.",
    verdict: "Check your API keys to see who really wins."
  };

  if (!apiKey) return fallback;

  try {
    const groq = new Groq({ apiKey });

    const prompt = `
      You are an expert tech judge hosting a "hackathon battle" between two developers based on their GitHub stats.
      Analyze these two developers and decide who would win in a head-to-head coding competition.

      Developer 1: ${user1Data.user.login}
      Public Repos: ${user1Data.user.public_repos} | Followers: ${user1Data.user.followers}
      Stars: ${user1Data.stats.totalStars} | Forks: ${user1Data.stats.totalForks}
      Top Languages: ${user1Data.languages.slice(0, 3).map((l: any) => l.name).join(", ")}

      Developer 2: ${user2Data.user.login}
      Public Repos: ${user2Data.user.public_repos} | Followers: ${user2Data.user.followers}
      Stars: ${user2Data.stats.totalStars} | Forks: ${user2Data.stats.totalForks}
      Top Languages: ${user2Data.languages.slice(0, 3).map((l: any) => l.name).join(", ")}

      Provide a JSON response with exactly this structure:
      {
        "winner": "The exact login username of the winner, or 'Draw'",
        "title": "A fun, dramatic title for this matchup (e.g. 'The Systems Architect vs The Web Wizard')",
        "analysis": "A fun, detailed 3-4 sentence breakdown of why this person won based on their stats and languages.",
        "verdict": "A punchy final verdict (e.g. 'Developer X takes the crown through sheer open-source dominance.')"
      }
    `;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    let text = result.choices[0]?.message?.content || "";
    text = text.replace(/```json\\n/g, "").replace(/```/g, "").trim();

    return JSON.parse(text) as VersusMatchup;
  } catch (error) {
    console.error("Error generating versus matchup:", error);
    return fallback;
  }
}

// ─── Graveyard Eulogies ─────────────────────────────────────

export interface GraveyardEulogy {
  repoName: string;
  eulogy: string;
  causeOfDeath: string;
}

export async function generateGraveyardEulogies(
  deadRepos: { name: string; description: string | null; language: string | null; pushed_at: string }[]
): Promise<GraveyardEulogy[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || deadRepos.length === 0) return [];

  try {
    const groq = new Groq({ apiKey });

    const repoList = deadRepos
      .slice(0, 5)
      .map(
        (r) =>
          `- ${r.name}: "${r.description || "No description"}" (${r.language || "Unknown language"}, last pushed: ${r.pushed_at})`
      )
      .join("\n");

    const prompt = `
      You are a sarcastic, dark-humor comedian writing eulogies for abandoned GitHub repositories.
      These projects once had dreams but now sit abandoned and forgotten.

      Dead repositories:
      ${repoList}

      For each repo, write a JSON array where each element has:
      {
        "repoName": "exact repo name",
        "eulogy": "A hilarious 1-2 sentence eulogy for this project. Be witty, sarcastic, and reference the repo's name/description/language. Think 'roast meets funeral speech'.",
        "causeOfDeath": "A funny, short cause of death (e.g., 'Developer discovered Rust', 'Tuesday happened', 'Imposter syndrome')"
      }

      Return ONLY a JSON object with key "eulogies" containing the array. No markdown.
    `;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    let text = result.choices[0]?.message?.content || "";
    text = text.replace(/```json\n/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);
    return (parsed.eulogies || []) as GraveyardEulogy[];
  } catch (error) {
    console.error("Error generating graveyard eulogies:", error);
    return [];
  }
}

// ─── Nemesis Narrative ──────────────────────────────────────

export interface NemesisNarrative {
  title: string;
  story: string;
  prediction: string;
  userEdges: string[];
  nemesisEdges: string[];
}

export async function generateNemesisNarrative(
  userData: { login: string; public_repos: number; followers: number; totalStars: number; topLanguages: string[] },
  nemesisData: { login: string; public_repos: number; followers: number; totalStars: number; topLanguages: string[] }
): Promise<NemesisNarrative> {
  const apiKey = process.env.GROQ_API_KEY;
  const fallback: NemesisNarrative = {
    title: "The Rivalry Awaits",
    story: "AI narrative generation is currently unavailable.",
    prediction: "The saga continues...",
    userEdges: [],
    nemesisEdges: [],
  };

  if (!apiKey) return fallback;

  try {
    const groq = new Groq({ apiKey });

    const prompt = `
      You are an epic sports narrator commentating on the greatest coding rivalry of all time.
      Two developers with eerily similar GitHub profiles have been pitted against each other.

      HERO: ${userData.login}
      Repos: ${userData.public_repos} | Followers: ${userData.followers} | Stars: ${userData.totalStars}
      Languages: ${userData.topLanguages.join(", ")}

      NEMESIS: ${nemesisData.login}
      Repos: ${nemesisData.public_repos} | Followers: ${nemesisData.followers} | Stars: ${nemesisData.totalStars}
      Languages: ${nemesisData.topLanguages.join(", ")}

      Write a dramatic, over-the-top rivalry narrative. Return JSON:
      {
        "title": "A dramatic 'X vs Y' style title (e.g., 'The TypeScript Titan vs The Python Phantom')",
        "story": "A 3-4 sentence epic rivalry story. Be dramatic, funny, and reference their actual stats. WWE announcer energy.",
        "prediction": "A 1-sentence dramatic prediction of who will ultimately win this rivalry and why.",
        "userEdges": ["2-3 specific areas where the hero has an advantage"],
        "nemesisEdges": ["2-3 specific areas where the nemesis has an advantage"]
      }
    `;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    let text = result.choices[0]?.message?.content || "";
    text = text.replace(/```json\n/g, "").replace(/```/g, "").trim();

    return JSON.parse(text) as NemesisNarrative;
  } catch (error) {
    console.error("Error generating nemesis narrative:", error);
    return fallback;
  }
}

// ─── Stress Analysis Report ─────────────────────────────────

export interface StressReport {
  summary: string;
  triggerLanguage: string;
  triggerDay: string;
  recommendation: string;
  insight: string;
}

export async function generateStressReport(
  stressData: {
    overallStress: number;
    worstLanguage: string;
    worstDay: string;
    worstCommits: string[];
    totalCommits: number;
  }
): Promise<StressReport> {
  const apiKey = process.env.GROQ_API_KEY;
  const fallback: StressReport = {
    summary: "Insufficient data to generate a comprehensive stress analysis at this time.",
    triggerLanguage: stressData.worstLanguage || "Unknown",
    triggerDay: stressData.worstDay || "Unknown",
    recommendation: "Continue monitoring commit patterns over a longer period for more accurate analysis.",
    insight: `Analyzed ${stressData.totalCommits} commits across the developer's active repositories.`,
  };

  if (!apiKey) return fallback;

  try {
    const groq = new Groq({ apiKey });

    const prompt = `
      You are a senior developer productivity analyst producing a professional technical assessment of a developer's commit sentiment patterns.

      Developer Commit Data:
      - Overall Stress Index: ${stressData.overallStress}/100
      - Highest-Friction Language: ${stressData.worstLanguage}
      - Peak Stress Day: ${stressData.worstDay}
      - Total Commits Analyzed: ${stressData.totalCommits}
      - High-Friction Commit Messages: ${stressData.worstCommits.slice(0, 5).map(c => `"${c}"`).join(", ")}

      Write a professional, technical analysis report. Use data-driven language and be concise. Return JSON:
      {
        "summary": "A 2-3 sentence professional assessment of the developer's commit stress patterns. Reference specific data points. Use neutral, analytical tone — like a productivity consultant's executive summary.",
        "triggerLanguage": "The language correlated with highest friction, with a brief technical explanation of why this language tends to produce more stressed commits (e.g., complexity, debugging difficulty, tooling issues)",
        "triggerDay": "The day showing peak stress activity, with a professional observation about workflow patterns (e.g., 'Monday commits show elevated stress indicators, consistent with sprint planning overhead')",
        "recommendation": "A 1-2 sentence actionable recommendation to optimize the developer's workflow and reduce commit-time friction. Be specific and practical.",
        "insight": "A concise, data-backed observation derived from the commit patterns — something non-obvious that adds analytical value"
      }
    `;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    let text = result.choices[0]?.message?.content || "";
    text = text.replace(/```json\n/g, "").replace(/```/g, "").trim();

    return JSON.parse(text) as StressReport;
  } catch (error) {
    console.error("Error generating stress report:", error);
    return fallback;
  }
}
