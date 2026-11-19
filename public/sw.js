// Service worker: lets the installed app (and the site in any browser) open pages with no signal.
// The same approach as the Deovandski site's public/sw.js (Deovandski/Deovandski#160).
//
// What it saves on the visitor's device (Cache Storage, never sent anywhere):
//   - when it installs: the home page and the CSS and scripts it loads, plus the manifest and icons;
//   - the page the visitor was on when it installed (so a first visit to /ja/notes/ works offline too);
//   - every page the visitor opens afterwards, in any language;
//   - CSS, scripts and fonts as they load (small, and their names change with every build).
// What it never saves: images, video, or anything from other websites, so it can't fill the phone's storage.
//
// Pages come from the network. With no answer in 4 seconds, or no signal, the saved copy is used if there is one.
// Every address the worker handles is under its scope (the site's base path), so on a shared address like
// deovandski.github.io it never touches the other repos' sites, and its saved files are named after that path.
//
// Change VERSION to throw away everything saved and start over.
const VERSION = 'v1';
const SCOPE = new URL(self.registration.scope);
const PREFIX = `site${SCOPE.pathname}`;         // "site/REPO-NAME/": one name per site on a shared origin
const CACHE = `${PREFIX}${VERSION}`;
const HOME = SCOPE.href;
const EXTRA = ['manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png', 'icon.svg'].map((p) => new URL(p, SCOPE).href);
const WAIT_MS = 4000;

const inScope = (url) => url.origin === SCOPE.origin && url.href.startsWith(SCOPE.href);
/** A page's address without #hash or ?query, so /notes/?x and /notes/#top share one saved copy. */
const pageKey = (url) => url.origin + url.pathname;

/** Same-site stylesheets, scripts and preloads in a page's HTML (never its images). */
function assetsOf(html, pageUrl) {
  const found = new Set();
  for (const m of html.matchAll(/<(?:link|script)\b[^>]*?\s(?:href|src)="([^"]+)"[^>]*>/gi)) {
    if (/^<link/i.test(m[0]) && !/rel="(?:stylesheet|modulepreload|preload)"/i.test(m[0])) continue;
    const url = new URL(m[1].replace(/&amp;/g, '&'), pageUrl);
    if (inScope(url)) found.add(url.href);
  }
  return [...found];
}

/** Fetch a page, save it and (best effort) the CSS and scripts it needs. */
async function savePage(pageUrl) {
  const url = new URL(pageUrl);
  if (!inScope(url)) return;
  const cache = await caches.open(CACHE);
  const res = await fetch(url.href, { cache: 'no-cache' });
  if (!res.ok || !(res.headers.get('content-type') || '').includes('text/html')) return;
  const html = await res.clone().text();
  await cache.put(pageKey(url), res);
  await Promise.allSettled(assetsOf(html, url.href).map((f) => cache.add(f)));
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    await savePage(HOME).catch(() => {});
    const cache = await caches.open(CACHE);
    await Promise.allSettled(EXTRA.map((f) => cache.add(f)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

// The page that registered the worker loaded before the worker existed; it asks to be saved (see Base.astro).
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'save-page' && typeof data.url === 'string') event.waitUntil(savePage(data.url).catch(() => {}));
});

async function networkFirst(request, key) {
  const cache = await caches.open(CACHE);
  const network = fetch(request).then((res) => {
    if (res.ok) cache.put(key, res.clone());
    return res;
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, WAIT_MS));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
  } catch {
    // no signal: fall through to the saved copy
  }
  return (await cache.match(key)) ?? network;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (!inScope(url)) return; // other websites, and other repos' sites on the same address: hands off

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, pageKey(url)));
    return;
  }
  if (!['style', 'script', 'font', 'manifest'].includes(request.destination)) return; // images and the rest: the browser's normal way

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const saved = await cache.match(request, { ignoreSearch: true });
    if (saved) return saved;
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  })());
});
