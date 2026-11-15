# Why Astro + TypeScript

Claude Code and Deo bashed heads on the technical architecture for the template. This page records how that went, the pros and cons we weighed, and why we landed on **Astro + TypeScript**. Read it before proposing a different stack, so the same argument doesn't have to happen twice.

## How we got here

1. **Claude's first cut was plain HTML and JavaScript.** It copied vraki-windows: one hand-written page with no build step, and a Node script with one dependency for translations. It worked, but nobody had chosen it. It was a default carried over from the last repo.
2. **Deo asked why not Astro or TypeScript**, given that the Deovandski site already uses Astro, and asked for the pros and cons.
3. **Claude laid them out** and first recommended a middle path: keep plain JavaScript and add type checking through comments (`// @ts-check` and JSDoc), with no build step.
4. **Deo changed the question.** Claude does the grunt work in these repos, so the stack should make Claude's work easier and safer. And one template has to fit small and big repos alike, so a repo can grow without being moved to a new stack later.
5. **With those two goals, Astro + TypeScript won.** Claude agreed and rebuilt the template on it.

## The options

### Plain HTML and JavaScript
**Pros**
- No build step: open the HTML file and it works.
- Almost nothing to install or upgrade. Fast CI.
- Anyone can read and edit it.

**Cons**
- The header, footer and Settings dialog get copied into every page. Fine for one page, painful at ten, and every copy is a place to forget an edit.
- No types: a typo in a setting name or a wrong argument only shows up when someone happens to run that code.
- Bigger sites end up rebuilding what a framework already has (layouts, Markdown pages, page lists).

### TypeScript (for the scripts and tools)
**Pros**
- Type errors catch mistakes before anything runs, and editors autocomplete properly.
- Current Node runs `.ts` files directly by stripping the types, so the tools need no compile step.

**Cons**
- Browser code needs a build step to turn TypeScript into JavaScript (Astro does this for free).
- A few more files: `tsconfig.json`, `@types/node`.

### Astro
**Pros**
- Layouts and components: the header, gear and dialog are written once.
- Content collections: a folder of Markdown files with a schema, so a big repo adds content by adding files, and a file with a missing or wrong field fails the check.
- Pages are files: `src/pages/about.astro` becomes `/about/`.
- The same stack as the Deovandski site, so what is learned in one repo carries over.
- It outputs plain HTML, which is exactly what the translation tool needs (Deovandski#87 already planned to translate Astro's built pages).

**Cons**
- A build step, and a bigger dependency tree (Astro, Vite and friends).
- Astro releases a new major version now and then, and some of them change things.
- More than a one-page site strictly needs.

## Why Astro + TypeScript won

**Claude does the grunt work, so the stack should catch Claude's mistakes.**
- `npm run check` type-checks the scripts, the tools, every `.astro` file and every content file against its schema. Claude gets a list of exact errors to fix instead of discovering a broken page later, or never.
- Components mean one edit per change. Without them, changing the footer means editing every page, and missing one is easy at scale.
- Astro and TypeScript are widely used and well documented, so Claude knows them well and makes fewer guesses.
- The conventions are written down in CLAUDE.md ("Where things go"), so every repo made from the template is laid out the same way.

**Small and big repos alike, with no move to a new stack later.**
- A small repo is one page (`src/pages/index.astro`) inside the shared layout. That is barely more than the plain HTML version.
- A big repo adds pages and content collections to the same structure. Going from one page to a hundred never means switching stacks.
- The translation tool works on the built pages, so it doesn't care whether a page came from a component, a Markdown file or a collection. It now finds nested pages (`/notes/first-note/`) and keeps links inside the reader's language.

**What we gave up, on purpose**
- **"Open the HTML file and it works."** Now it's `npm run dev` for English or `npm run build` and `npm run preview` for every language. Claude runs those anyway.
- **A tiny dependency list.** Upgrades get their own PR and go through check, build and a look at the pages.
- **vraki-windows stays plain HTML.** It's a finished one-page archive site, and moving it would be churn. If it ever grows, the template is ready.

## How the pieces fit

```
src/ (English, Astro + TypeScript)  ──astro build──▶  dist/  ──tools/i18n.ts build──▶  _site/  ──▶  GitHub Pages
                                                                  ▲                          ├─ /…          English
                                       content/i18n/<lang>/  ─────┘                          └─ /<lang>/…   each language
```

- `site.config.json`: the one place for the address, the base path and the language order.
- `npm run check`: types and schemas. `npm run build`: Astro, then translations. `npm run preview`: serves `_site/` the way GitHub Pages does.
- `npm run init -- <repo-name>`: the first step in a new repo. It fills in the name everywhere and keeps the stored translations matching.

## When to revisit this

- Astro stops being maintained, or a new major version would mean rewriting most pages.
- Most repos turn out to need an app (a backend, logins, live data) rather than a static site.
- Node's type stripping goes away, and the tools would need a compile step.

If any of these happen, write the new options down the same way, pros and cons, and decide together again.

-Deo & Claude Code
