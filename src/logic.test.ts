import {describe,it,expect} from "vitest";
import {filterRepos,languageCounts,validUsername,type Repo} from "./logic";
const a:Repo={id:1,name:"alpha",full_name:"u/alpha",description:"hello typescript",html_url:"https://github.com/u/alpha",stargazers_count:8,forks_count:2,language:"TypeScript",updated_at:"2026-01-01",fork:false};
const b:Repo={...a,id:2,name:"beta",stargazers_count:3,language:"Python",description:null,updated_at:"2025-01-01"};
describe("dashboard helpers",()=>{
 it("validates usernames before API calls",()=>{expect(validUsername("octocat")).toBe(true);expect(validUsername("-invalid")).toBe(false);expect(validUsername("abc/name")).toBe(false);});
 it("filters and sorts repositories",()=>{expect(filterRepos([b,a],"HELLO","All","stars").map(r=>r.name)).toEqual(["alpha"]);expect(filterRepos([b,a],"","All","stars")[0].name).toBe("alpha");});
 it("counts language use",()=>{expect(languageCounts([a,b,a])[0]).toEqual({name:"TypeScript",count:2});});
});
