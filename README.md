# Deovandski-repo-template

The starting point for Deovandski's repositories, with the patterns the other repos settled on ([HusbandOutWorld](https://github.com/Deovandski/HusbandOutWorld), [Deovandski](https://github.com/Deovandski/Deovandski), [vraki-windows](https://github.com/Deovandski/vraki-windows)):

- **A website in 15 languages**, translated ahead of time and only where the English changed ([tools/i18n.mjs](tools/i18n.mjs), [content/i18n/](content/i18n)). The settings menu, header and footer come already translated.
- **A Settings gear** (top right) with Language, "Want a language added?" and Text size, remembered in the browser.
- **Claude rules** in [CLAUDE.md](CLAUDE.md): originals stay untouched, translation rules, names by sound, no secrets in git.
- **Honest docs:** [AI-DISCLOSURE.md](AI-DISCLOSURE.md) (IBM-style attribution statement and a file-by-file table), [PRIVACY.md](PRIVACY.md), [SECURITY.md](SECURITY.md), and a [LICENSE](LICENSE) that is MIT for code and lists what it does not cover (the Vraki typeface, the #HusbandOutWorld series and its trademarks).
- **Workflows:** CI (site builds, translation coverage report, leftover placeholders, no secrets) and Website (build and deploy to GitHub Pages).
- **An "Add a language" issue form** and a PR template with an AI-assistance checkbox.

## Starting a new repo

1. On GitHub, **Use this template › Create a new repository**.
2. Replace the placeholder name everywhere, then re-key the stored translations (their English contains links with the name):
   ```sh
   git grep -l REPO-NAME -- ':!README.md' | xargs sed -i 's/REPO-NAME/your-repo/g'
   npm ci
   node tools/i18n.mjs rehash
   ```
3. Rewrite `site/index.html` with the project's content (keep the gear, the settings dialog, `#ui-strings` and the inline `<head>` script). Fill in the `_(…)_` parts of AI-DISCLOSURE.md and the top of CLAUDE.md. In LICENSE, keep only the "Not covered" items that apply.
4. Translate: `node tools/i18n.mjs status`, then follow "Translations" in CLAUDE.md (or ask Claude to "translate the site").
5. Turn on Pages: **Settings › Pages › Source = GitHub Actions**, then run the Website workflow.
6. Replace this README with the project's own (the "Website" and "Disclosure" ideas from vraki-windows' README are a good shape).

## Layout

```
site/                  the website, English source (index.html, css/, js/)
content/i18n/<lang>/   translations: meta.json, glossary.json, _shared.json, pages/
tools/i18n.mjs         build, status, todo, apply, prune, rehash
i18n.config.json       site address, source folder, Language menu order
.github/               CI, Website (Pages), issue form, PR template
CLAUDE.md              rules for Claude
AI-DISCLOSURE.md       what the AI did, file by file
PRIVACY.md, SECURITY.md, LICENSE
```

## Try it

```sh
npm ci
node tools/i18n.mjs build
npx serve _site     # or any static server; open /ja/ or /ar/
```

## Disclosure

This template was written with Claude (Anthropic) from the patterns in Deovandski's repositories; see [AI-DISCLOSURE.md](AI-DISCLOSURE.md). The translations of the shared interface text are AI-written.

## License

[MIT](LICENSE) © 2026 Deovandski Skibinski Junior.
