import {useEffect,useMemo,useState,type FormEvent} from "react";
import {ArrowUpRight,BookOpen,Code2,GitFork,Github,Search,Star,Clock3,RefreshCw,ExternalLink,AlertCircle,Layers3} from "lucide-react";
import {filterRepos,formatCount,languageCounts,validUsername,type Repo,type SortBy} from "./logic";
interface User {login:string;name:string|null;avatar_url:string;bio:string|null;html_url:string;public_repos:number;followers:number;following:number}
const API="https://api.github.com";
const languages=["#a78bfa","#67e8f9","#a3e635","#fbbf24","#fb7185","#93c5fd","#c4b5fd"];
async function json<T>(url:string,signal:AbortSignal):Promise<T>{
 const res=await fetch(url,{headers:{Accept:"application/vnd.github+json"},signal});
 if(!res.ok){if(res.status===404)throw new Error("GitHub user not found. Check the username.");if(res.status===403||res.status===429)throw new Error("GitHub API rate limit reached. Try again later.");throw new Error("GitHub request failed. Please retry.");}
 return res.json() as Promise<T>;
}
function App(){
 const [draft,setDraft]=useState("Toufiqul-27"),[username,setUsername]=useState("Toufiqul-27");
 const [user,setUser]=useState<User|null>(null),[repos,setRepos]=useState<Repo[]>([]);
 const [busy,setBusy]=useState(true),[error,setError]=useState("");
 const [search,setSearch]=useState(""),[language,setLanguage]=useState("All"),[sort,setSort]=useState<SortBy>("stars"),[page,setPage]=useState(1);
 useEffect(()=>{const controller=new AbortController();setBusy(true);setError("");setUser(null);setRepos([]);
 Promise.all([json<User>(`${API}/users/${encodeURIComponent(username)}`,controller.signal),json<Repo[]>(`${API}/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner&sort=updated`,controller.signal)])
 .then(([profile,all])=>{setUser(profile);setRepos(all);setSearch("");setLanguage("All");setPage(1);})
 .catch((e:unknown)=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:"Unexpected error");})
 .finally(()=>{if(!controller.signal.aborted)setBusy(false);});
 return()=>controller.abort();
 },[username]);
 const langs=useMemo(()=>languageCounts(repos),[repos]);
 const items=useMemo(()=>filterRepos(repos,search,language,sort),[repos,search,language,sort]);
 const visible=items.slice((page-1)*9,page*9),pages=Math.max(1,Math.ceil(items.length/9));
 const stars=repos.reduce((sum,r)=>sum+r.stargazers_count,0);
 function submit(e:FormEvent){e.preventDefault();const n=draft.trim();if(!validUsername(n)){setError("Enter a valid GitHub username.");return;}setUsername(n);if(n===username){setError("");setPage(1);}}
 function changeSearch(v:string){setSearch(v);setPage(1);}
 function changeLanguage(v:string){setLanguage(v);setPage(1);}
 return <div className="shell">
  <nav className="nav"><div className="brand"><span className="brand-icon"><Github size={21}/></span><span>GitHub<span className="brand-accent">Insights</span></span></div><a href="https://github.com/Toufiqul-27" target="_blank" rel="noopener noreferrer" className="nav-link">Created by Toufiqul <ArrowUpRight size={15}/></a></nav>
  <main><div className="eyebrow"><span className="dot"/> DEVELOPER ANALYTICS / PUBLIC DATA</div>
  <header className="intro"><div><h1>Understand the code<br/><span>behind the profile.</span></h1><p>Explore repositories, language trends and open-source activity. No login required.</p></div><div className="halo" aria-hidden="true"><div className="halo-inner"><Code2 size={54}/></div></div></header>
  <form onSubmit={submit} className="searchbox"><Search size={21}/><input aria-label="GitHub username" placeholder="Enter a GitHub username" value={draft} onChange={e=>setDraft(e.target.value)}/><button type="submit" disabled={busy}>{busy?<RefreshCw size={16} className="spin"/>:"Analyze profile"}<ArrowUpRight size={17}/></button></form>
  {error&&<div className="error" role="alert"><AlertCircle size={19}/>{error}</div>}
  {busy&&<div className="loading" role="status"><RefreshCw className="spin"/> Analyzing public repositories…</div>}
  {!busy&&user&&<><section className="profile card"><img src={user.avatar_url} alt={user.login+" avatar"}/><div className="identity"><span className="label">PROFILE OVERVIEW</span><h2>{user.name||user.login}</h2><p>@{user.login} {user.bio&&<span>· {user.bio}</span>}</p></div><a className="quiet-btn" href={user.html_url} target="_blank" rel="noopener noreferrer">View on GitHub <ExternalLink size={15}/></a></section>
  <section className="stats" aria-label="Repository statistics">
  <div className="stat card"><BookOpen/><span className="label">PUBLIC REPOS</span><strong>{formatCount(user.public_repos)}</strong><small>Reported by GitHub</small></div>
  <div className="stat card"><Layers3/><span className="label">LOADED REPOS</span><strong>{repos.length}</strong><small>First 100 owned repos</small></div>
  <div className="stat card"><Star/><span className="label">TOTAL STARS</span><strong>{formatCount(stars)}</strong><small>In loaded repositories</small></div>
  <div className="stat card"><Github/><span className="label">FOLLOWERS</span><strong>{formatCount(user.followers)}</strong><small>Public profile</small></div>
  </section>
  <section className="language-section card"><div className="section-head"><div><span className="label">REPOSITORY BREAKDOWN</span><h2>Top languages</h2></div><span className="muted">Based on primary repo language</span></div>
  {langs.length? <div className="bars">{langs.map((x,i)=><div className="bar-line" key={x.name}><div className="bar-title"><span><i style={{background:languages[i%languages.length]}}/>{x.name}</span><b>{x.count}</b></div><div className="bar-track"><div className="bar-fill" style={{width:`${100*x.count/repos.length}%`,background:languages[i%languages.length]}}/></div></div>)}</div>:<p className="muted">No language information for the loaded repositories.</p>}
  </section>
  <section className="repository-section"><div className="section-head"><div><span className="label">CODE EXPLORER</span><h2>Repositories <span className="count">{items.length}</span></h2></div></div>
  <div className="filters"><label><span className="visually-hidden">Search repositories</span><input value={search} onChange={e=>changeSearch(e.target.value)} placeholder="Search repositories…" /></label><label><span className="visually-hidden">Language</span><select value={language} onChange={e=>changeLanguage(e.target.value)}><option>All</option>{langs.map(l=><option key={l.name}>{l.name}</option>)}</select></label><label><span className="visually-hidden">Sort repositories</span><select value={sort} onChange={e=>{setSort(e.target.value as SortBy);setPage(1);}}><option value="stars">Most stars</option><option value="updated">Recently updated</option><option value="name">Name A–Z</option></select></label></div>
  {items.length? <div className="repo-grid">{visible.map(r=><article className="repo card" key={r.id}><div className="repo-top"><span className="repo-symbol"><BookOpen size={20}/></span><a href={r.html_url} target="_blank" rel="noopener noreferrer" aria-label={"Open "+r.name}><ArrowUpRight size={20}/></a></div><h3>{r.name}</h3><p>{r.description||"No description provided."}</p><div className="repo-meta"><span><i className="mini-dot"/> {r.language||"Other"}</span><span><Star size={14}/>{r.stargazers_count}</span><span><GitFork size={14}/>{r.forks_count}</span></div><div className="repo-footer"><Clock3 size={13}/> Updated {new Date(r.updated_at).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})}</div></article>)}</div>:<div className="empty card">No repositories match these filters.</div>}
  {pages>1&&<div className="pagination"><button disabled={page<=1} onClick={()=>setPage(v=>v-1)}>Previous</button><span>Page {page} of {pages}</span><button disabled={page>=pages} onClick={()=>setPage(v=>v+1)}>Next</button></div>}
  </section></>}
  <footer>Powered by the public GitHub REST API · Limited to first 100 owned repositories · <a href="https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api" target="_blank" rel="noopener noreferrer">API limits</a></footer>
  </main></div>;
}
export default App;
