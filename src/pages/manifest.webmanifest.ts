// The web app manifest: what Android, desktop Chrome and Edge need to offer "Install app" for the site.
// Built here (not in public/) so every address starts with the base path from site.config.json.
// The same as the Deovandski site's (Deovandski/Deovandski#160). Swap the icons in public/icons/ for the repo's own.
import type { APIRoute } from 'astro';
import { url } from '../lib/site';

const NIGHT = '#07090a'; // --night in src/styles/site.css, the icon's background

export const GET: APIRoute = () => {
  const base = url();
  const manifest = {
    id: base,
    name: 'Project name',
    short_name: 'Project name',
    description: 'One or two sentences about the project, for search engines and link previews.',
    lang: 'en',
    start_url: base,
    scope: base, // covers every language folder too (/zh/, /ja/, …)
    display: 'standalone',
    background_color: NIGHT,
    theme_color: NIGHT,
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
