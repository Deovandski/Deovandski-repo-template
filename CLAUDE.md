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

## Build reusable components
If a piece of UI could be useful twice, in this repo or in another of Deovandski's repos, build it as a reusable component instead of one-off code in a page. Examples: a clock, a counter or score card, a board, a gallery, a map, a picker.
- **Where:** `src/components/reusable/`, one `.astro` file each (plus a folder for any font or image it needs), with no imports from the site, listed in a README in that folder.
- **Self-contained:** everything it needs comes in as options/props or data attributes, with no reliance on page-specific code. Its styles are scoped to its own class and themed with CSS custom properties (with fallbacks). It works when used several times on one page.
- **Accessible:** text for screen readers, keyboard-friendly, and it respects `prefers-reduced-motion`.
- **Documented:** a comment at the top with a usage example and its options, plus a row in the list of reusable components.
- **Look before you build:** check the reusable components here and in the other repos first. The same rule is in Deovandski/Deovandski (`src/components/reusable/`: `SplitFlap`, a split-flap board, and `LedClock`, an LED countdown), Deovandski-repo-template, HusbandOutWorld, vraki-windows and Vraki-West-March-Campaign-D-D. Copy and adapt an existing component instead of starting over, and note where it came from.
- **Extract when you touch it:** when you change one-off UI that fits this rule, pull it out into a reusable component in the same PR.

## Pictures are clickable
Every picture opens bigger when pressed, in the one photo viewer (`src/components/reusable/PhotoViewer.astro`, already in `Base.astro`). Nothing to wire up: any `<img>` with alt text opens by itself, and so does a link straight to an image file. The same standard is in Deovandski/Deovandski, HusbandOutWorld, Vraki-West-March-Campaign-D-D and sinoi-the-fisherman.
- **Give every content picture real alt text.** The alt is the viewer's caption (and is translated). `alt=""` means decorative, and those don't open.
- **Dates:** the viewer shows the date, in the page's language, when it knows one: `data-date="YYYY-MM-DD"` (or `data-date-label="Circa 2013"`) on the picture, or a `YYYY-MM-DD` at the start of its file name.
- **Bigger copy:** pass `data-full` with a large `getImage()` copy when the page only ships a small size; otherwise the viewer uses the largest size in the srcset.
- **Galleries:** give each thumbnail button `data-gallery`, `data-full` and `data-alt` (and `data-date`), and ‹ › step through that gallery.
- **Opt out** with `data-no-zoom` on a picture or its container (game sprites, decorations). Pictures in links, buttons, the header and maps are already skipped.

## One source
Anything shown or used in more than one place (a widget, game, gallery, text, name, colour or setting) has one source that every place reads. Never paste a second copy.
- **The site's own facts** (name, description, theme colour, the Settings storage key) live in `src/lib/site.ts` (`SITE_NAME`, `SITE_DESCRIPTION`, `THEME_COLOR`, `STORAGE_KEY`). Pages, `Base.astro` and the app manifest import them.
- **UI used twice** is a reusable component (see above); **content shown twice** comes from one collection entry or data file.
- **When a copy can't be avoided** (CSS can't import TypeScript, so `--night` repeats `THEME_COLOR`), put a comment on both saying "change both", and say why in the PR.

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
| Change what AI tools and search engines read | Nothing to do for a new page: `tools/llms.ts` runs last in `npm run build` and writes `llms.txt`, `llms-full.txt`, an `index.md` copy of every page (its `<main>` only), `sitemap.xml`, and `robots.txt` when `base` is `""`. Mark decorations whose text means nothing read aloud (a clock's digits, glyph copies) with `data-llms-skip`; `hidden` and `aria-hidden="true"` are left out already. Pages in a folder (a collection) get their own section in `llms.txt`. |
| Change the installed app (PWA) | Name, colours and long-press `shortcuts`: `src/pages/manifest.webmanifest.ts` (built, so every address keeps the base path). Icons: `public/icons/` (192px, 512px, a maskable 512px with extra margin for Android's circle crop, and a 180px Apple touch icon); the template's are placeholders made from `public/icon.svg`. Offline: `public/sw.js` saves pages as they are visited, plus CSS, scripts and fonts, never images. **Freshness rule:** pages, and any file whose name stays the same from build to build (everything in `public/`, the manifest), are network first, fetched with `cache: 'no-cache'` (a cheap "not modified" when nothing changed), with the saved copy only offline or after 4 seconds; only Astro's hashed `_astro/` files are saved first. That way the first visit after a deploy always shows the new version. Bump `VERSION` whenever the worker's rules change, so old copies are thrown away. Base.astro links the manifest and registers the worker. |
| Verify the site in Google Search Console | Put Google's `google….html` file in `public/` exactly as it came (same name, same one line) and **never remove it**: Search Console re-checks it, and removing it un-verifies the site. A custom domain can use a DNS record instead (no file). Then Deo presses Verify and submits `sitemap.xml`. Steps: [docs/GOOGLE-SEARCH-CONSOLE.md](docs/GOOGLE-SEARCH-CONSOLE.md). |
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
`npm ci`, `npm run check`, `npm run build`. The Website workflow runs the build on every push to `main` and deploys `_site/` to GitHub Pages (Settings › Pages › Source = GitHub Actions). If `site.config.json` still has the `REPO-NAME` placeholder (the template repo itself, or a repo that skipped `npm run init`), the workflow runs `npm run init` with the real repo name in its build copy first, so the live site's CSS and links match where Pages serves it. **Site size:** GitHub Pages warns past 1 GB and may refuse the deploy. Astro copies the full-size original of every imported picture into `dist/_astro/`, even when pages only show resized copies, so `tools/prune-originals.ts` runs right after `astro build` (before `tools/i18n.ts` copies `dist/` into `_site/`) and deletes every picture there that no built file mentions. The originals in `src/` and `public/` are never touched. The Website workflow prints the deployed size on every run and warns past 800 MB; if a repo gets close, look for big files in `public/` (served as-is, never resized) and remember that every page is copied once per language. **Actions:** keep every workflow action on its current major release (all run on Node 24 now); GitHub retires old Node versions and warns first. Astro and TypeScript upgrades go in their own PR; run all three steps and look at the pages.
