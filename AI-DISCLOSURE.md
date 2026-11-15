# AI Disclosure

This repository was built with an AI assistant, **Claude** (by Anthropic), working from Deovandski's originals and direction. This page says plainly which parts are human work, which parts the AI wrote, and how the two fit together. Keep it up to date as the project grows.

## The short version
- **The ideas and the originals are human-made.** _(Say what they are: the story, the art, the 2017 code, the design files…)_ They are Deovandski Skibinski Junior's _(and name any artists)_.
- **No AI-generated images.** _(Keep this line only if it stays true.)_
- **Some things are AI-written, and they're labeled.** The website's code and its own text (menus, buttons, help), the build and translation tools, and the docs. _(List anything else.)_
- **The translations are AI-written, and every translated page says so.** The website is offered in Chinese, Japanese, Portuguese, Spanish, Arabic, Korean, Malay, Thai, German, Vietnamese, Italian, French, Hindi and Indonesian. Claude translated the English ahead of time (not machine translation on the fly), following the author's rules: names are written by sound, never translated. Each translated page carries a banner saying it was AI-translated from the original, with a link to the English. English is the source; if a translation and the English disagree, the English wins.
- **A human decides.** Deovandski directs the work, sets the rules and chooses what gets committed.

## Attribution statement
Modeled on the questions in IBM's [AI Attribution Toolkit](https://www.research.ibm.com/blog/AI-attribution-toolkit) (what AI was used, what it contributed, how much humans shaped it, and who is accountable):

> **AI system:** Claude, a large language model by Anthropic, used as an assistant with access to the repository files (_month year_).
> **Human contribution:** _(the originals, the concept, the rules, review and approval of every commit)_.
> **AI contribution:** _(e.g. designing and coding the website and its tools; translating the website; writing the docs)_.
> **Human modification:** Deovandski reviews and requests changes.
> **Accountability:** Deovandski Skibinski Junior.

## File by file

| Path | Where it comes from | What the AI did |
|---|---|---|
| [site/](site) | _(the author's content and design choices)_ | Designed and coded the page, the Settings menu (Language, Text size) and the styles. The site's own interface text is AI-written. |
| [tools/i18n.mjs](tools/i18n.mjs) | A Node port of [HusbandOutWorld's](https://github.com/Deovandski/HusbandOutWorld) `tools/i18n.py`. | Written by the AI. |
| [content/i18n](content/i18n) | The website's English. | **Translated by the AI**, segment by segment. Name spellings in each `glossary.json` follow the author's rule (by sound, never translated) and match HusbandOutWorld's. |
| [.github/](.github) | The workflows of Deovandski's other repositories. | Written by the AI. |
| [README.md](README.md), [CLAUDE.md](CLAUDE.md), [PRIVACY.md](PRIVACY.md), [SECURITY.md](SECURITY.md), this page | Patterns from Deovandski's other repositories. | Written by the AI, from [Deovandski-repo-template](https://github.com/Deovandski/Deovandski-repo-template). |

## Contributing
PRs are welcome, with or without AI help. If you used AI for a contribution, say so in the PR description and add a line to the table above.

© Deovandski Skibinski Junior.
