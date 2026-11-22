// Shared helpers for pages and components.
import config from '../../site.config.json' with { type: 'json' };

export const site = config;

// One source for what the site says about itself. Pages, the layout and the app manifest read these; don't type them
// again anywhere (see "One source" in CLAUDE.md). `npm run init -- <repo> --name "…"` fills in SITE_NAME.
/** The site's name: header, home page, browser tab and installed app. */
export const SITE_NAME = 'Project name';
/** One or two sentences: the home page's description for search engines and link previews, and the app's. */
export const SITE_DESCRIPTION = 'One or two sentences about the project, for search engines and link previews.';
/** Browser bar and app colour: the icon's background. CSS can't import this, so --night in site.css repeats it. */
export const THEME_COLOR = '#07090a';
/** localStorage key for Settings. Base.astro puts it on <html data-store>, where its inline script and
 *  src/scripts/settings.ts both read it. */
export const STORAGE_KEY = 'REPO-NAME-site';

/** The base path without a trailing slash: "/REPO-NAME", or "" at a domain root. */
export const BASE = (config.base || '').replace(/\/$/, '');

/** A link inside the site: url('notes/') -> "/REPO-NAME/notes/". tools/i18n.ts moves these into each language. */
export function url(path = ''): string {
  return `${BASE}/${path.replace(/^\//, '')}`;
}

/** The repository on GitHub, for "source" and "issues" links. */
export const REPO_URL = 'https://github.com/Deovandski/REPO-NAME';

/** Header links. Add a page by adding a file under src/pages/ and, if it belongs in the menu, a line here. */
export const NAV: { href: string; label: string }[] = [
  { href: url('notes/'), label: 'Notes' },
  { href: url('#privacy'), label: 'Privacy' },
];
