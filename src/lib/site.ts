// Shared helpers for pages and components.
import config from '../../site.config.json' with { type: 'json' };

export const site = config;

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
