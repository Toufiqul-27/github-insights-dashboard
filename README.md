# GitHub Insights Dashboard

A responsive, midnight-violet dashboard for exploring **public GitHub profiles** and their repositories. Created as a practical frontend portfolio project.

## Features

- Search any public GitHub username, with validation and useful error states
- Profile summary, follower count, star total and primary-language breakdown
- Filter by repository name/description and language; sort by stars, updated date or name
- Paginated, responsive repository cards linking to actual source code
- Loading, user-not-found and GitHub API rate-limit handling
- Automated utility tests and GitHub Actions build workflow

## Tech

React 19 · TypeScript · Vite · Lucide React · GitHub REST API · Vitest · CSS

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

```bash
npm test
npm run build
```

## Deployment

This is a **static frontend**, so it can be deployed on GitHub Pages, Vercel or Netlify. Vite's base is relative (`./`) for subpath hosting. For Pages, build the `dist/` directory or configure a Pages deployment workflow.

## Data limitations

GitHub's **unauthenticated REST API** has a low rate limit. This demo fetches the first **100 owned public repositories** per user, not the entire contribution history. Language counts reflect each repository's *primary* language, not actual bytes or coding hours. Star totals are limited to the loaded repositories. This app stores no account tokens.

## Testing

`src/logic.test.ts` covers username validation, search/sort logic and language counting. CI runs tests and the production build.

## Author

[Toufiqul Islam](https://github.com/Toufiqul-27)
