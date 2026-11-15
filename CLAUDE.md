# REPO-NAME

<!-- One paragraph: what this repository is, and anything that must never change (originals, legacy code, store identities). -->

The website is **Astro + TypeScript**, built for small and big repos alike; the reasons are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). English is written in `src/`; translations are added after the build.

## Rules
- **Originals stay untouched.** Keep the author's source material (story text, art, old code, design files) exactly as it is, in its own folder (`Legacy/`, `legacy/`, …). Display fixes happen in the build, never in the originals.
- **Never invent content.** The website shows the author's words. Interface text and docs can be written; story, lore and facts come from the originals or from the author.
- **No secrets in git:** no `.env`, keys, certificates or store identities (`.gitignore` and CI cover the usual ones).
- **The Vraki typeface** (if this repo includes it) is not MIT and must not be altered. Copy it unaltered from HusbandOutWorld's `Logo and Font` into `public/fonts/` with its `LICENSE.md`. Text shown in it is English letters: mark it `translate="no"`.
- **Keep the disclosure honest.** When AI does a new kind of work, add a row to AI-DISCLOSURE.md. Commits Claude contributes to carry `Co-Authored-By: Claude`.
- **Privacy:** anything the site stores or sends must be listed in PRIVACY.md and in the site's Privacy section.
- **Plain English** in docs, commits and PRs: short sentences, no jargon the author didn't use first.

## Before every PR
1. `npm run check`: TypeScript, `.astro` files and content schemas. Fix every error; don't silence one with `any` or `@ts-ignore` unless you say why in a comment.
2. `npm run build`: Astro builds `dist/`, then `tools/i18n.ts` writes `_site/` with every language.
3. `npm run preview` serves `_site/` at the base path, like GitHub Pages. Look at the changed pages in English and at least one translated language (Arabic for layout changes) at desktop (1280px) and phone (390px) widths.

## Where things go
| You want to… | Do this |
|---|---|
| Add a page | A file in `src/pages/` (`about.astro` → `/about/`). Wrap it in `<Base title="…" description="…">`. Add it to `NAV` in `src/lib/site.ts` if it belongs in the menu. |
| Add many similar pages (posts, chapters, lore entries) | A content collection: a folder in `src/content/`, its schema in `src/content.config.ts`, and a `[...slug].astro` page that lists or renders it (copy `notes`). The schema is the contract: `npm run check` fails on a file that doesn't match it. |
| Change the header, footer or anything on every page | `src/layouts/Base.astro` or a component in `src/components/`. Never paste the header into a page. |
| Link inside the site | `url('notes/')` from `src/lib/site.ts`, never a bare `/notes/` (the base path differs per repo, and `tools/i18n.ts` moves `url()` links into each language). |
| Add a script | A `.ts` file in `src/scripts/`, imported from a `<script>` tag in a page or component. Text it shows comes from `t("key")` (see Translations). |
| Add a style | `src/styles/site.css`. Font sizes are `calc(Npx * var(--scale))`, except header chrome (nav, gear), which stays fixed. |
| Add a file served as-is (images, fonts, PDFs) | `public/`. Link it with `url('images/x.webp')`. |
| Change the site address, base path or language order | `site.config.json` (Astro, the layout and `tools/i18n.ts` all read it). |

## Translations (Chinese, Japanese, Portuguese, Spanish, Arabic, Korean, Malay, Thai, German, Vietnamese, Italian, French, Hindi, Indonesian)
The website is also published at `/zh/`, `/ja/`, `/pt/`, `/es/`, `/ar/`, `/ko/`, `/ms/`, `/th/`, `/de/`, `/vi/`, `/it/`, `/fr/`, `/hi/` and `/id/`, the same way as HusbandOutWorld (HusbandOutWorld#50), the Deovandski site (Deovandski#87) and vraki-windows (vraki-windows#2). Translations are written ahead of time by Claude and committed in `content/i18n/<lang>/` (not to be confused with `src/content/`, which holds English content collections). `tools/i18n.ts` translates the **built** pages, so pages, components and collections need nothing special. See the top of [tools/i18n.ts](tools/i18n.ts) for how it works.
- **Translate only what changed.** Every segment is stored under a hash of its English, so unchanged English is never translated again. Never re-translate segments that already have a translation, and never "improve" one unless the author asks.
- **The loop:** `npx astro build`, then `npm run i18n -- status`, then for each language `npm run i18n --silent -- todo --lang ja > work.json` (add `--page notes/` or `--max-words 6000` to split a big batch). Fill in each item's `"t"`, then `npm run i18n -- apply work.json`. `npm run build` and `npm run preview` to check the pages. `npm run i18n -- prune` drops translations whose English is gone; `rehash` re-keys them after a find/replace that touched the English.
- **When to translate:** not on every commit. English changes never wait for translations (untranslated segments show in English, marked `lang="en"`; CI reports the gap and never blocks). Translate in batches, after a change merges or when asked. Each batch is its own PR; a small site can do every language in one PR, a big one goes one language (or one section) per PR.
- **Keep the HTML exactly.** Translate the visible text (and alt/title/aria-label text) only. Every tag, link and attribute in `"en"` must appear unchanged in `"t"` (`apply` warns when they differ). Don't translate URLs, file names, code, product names or `#HusbandOutWorld`.
- **Names are written by sound, never translated** (the author's rule): katakana in Japanese; the closest-sounding spelling in Chinese, Korean, Arabic, Thai and Hindi; unchanged in the Latin-script languages. Follow and extend `content/i18n/<lang>/glossary.json`, and keep spellings in step with HusbandOutWorld's glossaries so the series reads the same everywhere. Real people (Deovandski, Mitsukiven, Feiourm) and *A Husband Out of This World* stay in Latin letters.
- **Variants:** Simplified Chinese, Brazilian Portuguese, Spain Spanish, Malaysian Malay, German (Germany, informal *du*), French (France), standard Indonesian, standard Hindi. Arabic is right to left (`dir="rtl"`); fix anything placed with left/right in the RTL block of `src/styles/site.css`.
- **Anything that must not be translated** gets `translate="no"`: Vraki-typeface text, sample input/output, dates, names in a brand or logo.
- **Text a script shows** (button labels, status messages, tooltips) lives in the page: `<span data-k="key">English</span>` in the `ui-strings` slot of `<Base>`, read with `t("key")` from `src/scripts/i18n.ts`. Never hard-code visible English in TypeScript.
- **The banner** on translated pages comes from `content/i18n/<lang>/meta.json`: "AI-Translated to <language> from Original work by Deovandski". Repos with more authors list them, like HusbandOutWorld does.
- A language is offered to search engines (`hreflang`) and to the browser-language auto-select only once a page is 90% translated (`INDEX_COVERAGE` in tools/i18n.ts).
- **Adding a language:** create `content/i18n/<code>/meta.json` and `glossary.json` (copy another language's), add the code to `site.config.json`, then run the loop. Requests come in through the "Add a language" issue form, which the Settings menu's "Want a language added?" link opens.
- `npm run dev` shows English only, live. Translated pages exist only after `npm run build`.

## Website settings
The gear (top right, `src/components/Gear.astro`) opens Settings (`src/components/SettingsDialog.astro`): Language, "Want a language added?" and Text size, as on husbandoutworld.com. `src/scripts/settings.ts` saves the choices in `localStorage` under `REPO-NAME-site` (`lang`, `size`); the inline script in `Base.astro` applies them before the page paints. Text size scales every font size through `--scale` (17px = 1). Add more settings (theme, a Vraki mode, …) to the same dialog and the same storage key, and list them in PRIVACY.md.

## Building and deploying
`npm ci`, `npm run check`, `npm run build`. The Website workflow runs the build on every push to `main` and deploys `_site/` to GitHub Pages (Settings › Pages › Source = GitHub Actions). Astro and TypeScript upgrades go in their own PR; run all three steps and look at the pages.
