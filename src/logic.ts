export interface Repo {
 id: number; name: string; full_name: string; description: string | null;
 html_url: string; stargazers_count: number; forks_count: number;
 language: string | null; updated_at: string; fork: boolean;
}
export type SortBy = "stars" | "updated" | "name";
export function formatCount(value: number): string {
 return new Intl.NumberFormat("en-US", { notation: value >= 1000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}
export function languageCounts(repos: Repo[]): Array<{ name: string; count: number }> {
 const counts = new Map<string,number>();
 repos.forEach(r => { const k = r.language ?? "Other"; counts.set(k, (counts.get(k) ?? 0) + 1); });
 return [...counts].map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,7);
}
export function filterRepos(repos: Repo[], query: string, lang: string, sort: SortBy): Repo[] {
 const q = query.toLowerCase().trim();
 return repos.filter(r => (lang === "All" || (r.language ?? "Other") === lang) &&
 (r.name.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q)))
 .sort((a,b)=>sort==="stars" ? b.stargazers_count-a.stargazers_count :
 sort==="updated" ? Date.parse(b.updated_at)-Date.parse(a.updated_at) : a.name.localeCompare(b.name));
}
export function validUsername(value: string) {
 return /^(?!-)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(value);
}
