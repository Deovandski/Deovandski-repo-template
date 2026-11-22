// The web app manifest: what Android, desktop Chrome and Edge need to offer "Install app" for the site.
// Built here (not in public/) so every address starts with the base path from site.config.json.
// The same as the Deovandski site's (Deovandski/Deovandski#160). Swap the icons in public/icons/ for the repo's own.
import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_NAME, THEME_COLOR, url } from '../lib/site';

export const GET: APIRoute = () => {
  const base = url();
  const manifest = {
    id: base,
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: 'en',
    start_url: base,
    scope: base, // covers every language folder too (/zh/, /ja/, …)
    display: 'standalone',
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      { src: url('icons/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: url('icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: url('icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    // Long-press the installed app's icon to see these. Example:
    // { name: 'Notes', short_name: 'Notes', url: url('notes/'), icons: [{ src: url('icons/icon-192.png'), sizes: '192x192', type: 'image/png' }] },
    shortcuts: [],
  };
  return new Response(JSON.stringify(manifest, null, 2), { headers: { 'Content-Type': 'application/manifest+json' } });
};
