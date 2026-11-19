# Deovandski-repo-template

The starting point for Deovandski's repositories, small or big. It carries the patterns the other repos settled on ([HusbandOutWorld](https://github.com/Deovandski/HusbandOutWorld), [Deovandski](https://github.com/Deovandski/Deovandski), [vraki-windows](https://github.com/Deovandski/vraki-windows)):

- **Astro + TypeScript.** One page to start; more pages and Markdown content collections when the repo grows, with no change of stack. Why this stack: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- **A website in 15 languages**, translated ahead of time and only where the English changed ([tools/i18n.ts](tools/i18n.ts), [content/i18n/](content/i18n)). The settings menu, header and footer come already translated.
- **Readable by AI tools:** every build writes `llms.txt`, `llms-full.txt`, a Markdown copy of each page and `sitemap.xml` ([tools/llms.ts](tools/llms.ts)).
- **A Settings gear** (top right) with Language, "Want a language added?" and Text size, remembered in the browser.
- **Claude rules** in [CLAUDE.md](CLAUDE.md): what to run before a PR, where things go, translation rules, names by sound, no secrets in git.
- **Honest docs:** [AI-DISCLOSURE.md](AI-DISCLOSURE.md) (IBM-style attribution statement and a file-by-file table), [PRIVACY.md](PRIVACY.md), [SECURITY.md](SECURITY.md), and a [LICENSE](LICENSE) that is MIT for code and lists what it does not cover (the Vraki typeface, the #HusbandOutWorld series and its trademarks).
- **Workflows:** CI (type check, build, translation coverage report, leftover placeholders, no secrets) and Website (build and deploy to GitHub Pages).
- **An "Add a language" issue form** and a PR template with an AI-assistance checkbox.

## Starting a new repo

1. On GitHub, **Use this template › Create a new repository**.
2. Fill in the name (it is also the GitHub Pages path) and, if you like, the display name:
   ```sh
   npm ci
   npm run init -- your-repo --name "Your Project"
   ```
   For a custom domain or a `<user>.github.io` repo, also set `"base": ""` in `site.config.json`.
3. Rewrite `src/pages/index.astro` with the project's content. Keep or delete the `notes` collection (`src/content/notes/`, `src/pages/notes/`). Fill in the `_(…)_` parts of AI-DISCLOSURE.md and the top of CLAUDE.md. In LICENSE, keep only the "Not covered" items that apply.
4. `npm run check` and `npm run build`, then translate: `npm run i18n -- status` and follow "Translations" in CLAUDE.md (or ask Claude to "translate the site").
5. Turn on Pages: **Settings › Pages › Source = GitHub Actions**, then run the Website workflow.
   Then submit `https://<address>/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters). New sites usually aren't indexed, and search-based AI assistants only see indexed pages. A project site (under `/<repo>/`) can't point to its sitemap from a `robots.txt`, so this step is the only way they find it.
6. Replace this README with the project's own.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Live English site while editing |
| `npm run check` | Type check: TypeScript, `.astro` files, content schemas |
| `npm run build` | Astro builds `dist/`, then every language goes into `_site/` |
| `npm run preview` | Serves `_site/` at the base path, the way GitHub Pages does |
| `npm run i18n -- status` | How much of each language is translated (`todo`, `apply`, `prune`, `rehash` too) |
| `npm run init -- <repo-name>` | First step in a new repo |

## Layout

```
src/pages/             one file per page (index.astro → /, notes/ → /notes/)
src/layouts/Base.astro head, header with the gear, footer, Settings dialog, #ui-strings
src/components/        Gear, SettingsDialog, and anything shared
src/content/           content collections (Markdown + schema in src/content.config.ts)
src/scripts/           browser TypeScript (settings.ts, i18n.ts)
src/styles/site.css    styles (font sizes scale with Settings › Text size)
src/lib/site.ts        url(), the menu, the repo link
public/                files served as-is
content/i18n/<lang>/   translations: meta.json, glossary.json, _shared.json, pages/
tools/i18n.ts          translation build, status, todo, apply, prune, rehash, serve
tools/llms.ts          llms.txt, llms-full.txt, Markdown copies, sitemap.xml (runs last in the build)
tools/init.ts          fills in the repo name in a new repo
site.config.json       address, base path, language order
docs/ARCHITECTURE.md   why Astro + TypeScript
```

## Disclosure

This template was written with Claude (Anthropic) from the patterns in Deovandski's repositories; see [AI-DISCLOSURE.md](AI-DISCLOSURE.md). The translations of the shared interface text are AI-written.

## License

[MIT](LICENSE) © 2026 Deovandski Skibinski Junior.
