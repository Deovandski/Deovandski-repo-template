# REPO-NAME

<!-- One paragraph: what this repository is, and anything that must never change (originals, legacy code, store identities). -->

## Rules
- **Originals stay untouched.** Keep the author's source material (story text, art, old code, design files) exactly as it is, in its own folder (`Legacy/`, `legacy/`, …). Display fixes happen in the build, never in the originals.
- **Never invent content.** The website shows the author's words. Interface text and docs can be written; story, lore and facts come from the originals or from the author.
- **No secrets in git:** no `.env`, keys, certificates or store identities (`.gitignore` and CI cover the usual ones).
- **The Vraki typeface** (if this repo includes it) is not MIT and must not be altered. Copy it unaltered from HusbandOutWorld's `Logo and Font` with its `LICENSE.md`. Text shown in it is English letters: mark it `translate="no"`.
- **Keep the disclosure honest.** When AI does a new kind of work, add a row to AI-DISCLOSURE.md. Commits Claude contributes to carry `Co-Authored-By: Claude`.
- **Privacy:** anything the site stores or sends must be listed in PRIVACY.md and in the site's Privacy section.
- **Plain English** in docs, commits and PRs: short sentences, no jargon the author didn't use first.

## Translations (Chinese, Japanese, Portuguese, Spanish, Arabic, Korean, Malay, Thai, German, Vietnamese, Italian, French, Hindi, Indonesian)
The website is also published at `/zh/`, `/ja/`, `/pt/`, `/es/`, `/ar/`, `/ko/`, `/ms/`, `/th/`, `/de/`, `/vi/`, `/it/`, `/fr/`, `/hi/` and `/id/`, the same way as HusbandOutWorld (HusbandOutWorld#50), the Deovandski site (Deovandski#87) and vraki-windows (vraki-windows#2). Translations are written ahead of time by Claude and committed in `content/i18n/<lang>/`; English (`site/*.html`) is the source. See the top of [tools/i18n.mjs](tools/i18n.mjs) for how it works.
- **Translate only what changed.** Every segment is stored under a hash of its English, so unchanged English is never translated again. Never re-translate segments that already have a translation, and never "improve" one unless the author asks.
- **The loop:** `npm ci`, then `node tools/i18n.mjs status`, then for each language `node tools/i18n.mjs todo --lang ja > work.json`. Fill in each item's `"t"`, then `node tools/i18n.mjs apply work.json`. `node tools/i18n.mjs build` writes `_site/` to check the pages (serve it with any static server). `prune` drops translations whose English is gone; `rehash` re-keys them after a find/replace that touched the English (like renaming `REPO-NAME`).
- **When to translate:** not on every commit. English changes never wait for translations (untranslated segments show in English, marked `lang="en"`; CI reports the gap and never blocks). Translate in batches, after a change merges or when asked. Each batch is its own PR. A site this small can do every language in one PR.
- **Keep the HTML exactly.** Translate the visible text (and alt/title/aria-label text) only. Every tag, link and attribute in `"en"` must appear unchanged in `"t"` (`apply` warns when they differ). Don't translate URLs, file names, code, product names or `#HusbandOutWorld`.
- **Names are written by sound, never translated** (the author's rule): katakana in Japanese; the closest-sounding spelling in Chinese, Korean, Arabic, Thai and Hindi; unchanged in the Latin-script languages. Follow and extend `content/i18n/<lang>/glossary.json`, and keep spellings in step with HusbandOutWorld's glossaries so the series reads the same everywhere. Real people (Deovandski, Mitsukiven, Feiourm) and *A Husband Out of This World* stay in Latin letters.
- **Variants:** Simplified Chinese, Brazilian Portuguese, Spain Spanish, Malaysian Malay, German (Germany, informal *du*), French (France), standard Indonesian, standard Hindi. Arabic is right to left (`dir="rtl"`); fix anything placed with left/right in the RTL block of `site/css/site.css`.
- **Anything that must not be translated** gets `translate="no"`: Vraki-typeface text, sample input/output, names in a brand or logo.
- **Text a script writes** (button labels, status messages, tooltips) lives in `#ui-strings` in the page and is read with `t("key")`, so it is translated with the page. Never hard-code visible English in JavaScript.
- **The banner** on translated pages comes from `content/i18n/<lang>/meta.json`: "AI-Translated to <language> from Original work by Deovandski". Repos with more authors list them, like HusbandOutWorld does.
- A language is offered to search engines (`hreflang`) and to the browser-language auto-select only once a page is 90% translated (`INDEX_COVERAGE` in tools/i18n.mjs).
- **Adding a language:** create `content/i18n/<code>/meta.json` and `glossary.json` (copy another language's), add the code to `i18n.config.json`, then run the loop. Requests come in through the "Add a language" issue form, which the Settings menu's "Want a language added?" link opens.

## Website settings
The gear (top right) opens Settings: Language, "Want a language added?" and Text size, as on husbandoutworld.com. Choices are saved in `localStorage` under `REPO-NAME-site` (`lang`, `size`). Text size scales every font size through the `--scale` CSS variable (17px = 1): write new font sizes as `calc(Npx * var(--scale))`, except header chrome (nav, gear), which stays fixed so it doesn't wrap. Add more settings (theme, a Vraki mode, …) to the same dialog and the same storage key.

## Building
`npm ci`, then `node tools/i18n.mjs build --out _site`. The Website workflow does the same and deploys `_site/` to GitHub Pages (Settings › Pages › Source = GitHub Actions).
