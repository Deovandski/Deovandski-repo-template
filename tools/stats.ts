// Writes _site/stats.json: facts about this build that the /debug/ page ("Stats for nerds", #19) reads, so the browser
// never has to work them out. It runs last in `npm run build`.
//   code       which commit and pull request this build came from, when, and with which tools
//   site       pages, languages, files and size of what gets deployed
//   i18n       how much of each language is translated (the same counting as `npm run i18n -- status`)
// Commit, branch, pull request and repository are left out when the repo is private (GitHub Actions says so in its
// event file); a local build reads them from git.
// Node runs this file directly: `node tools/stats.ts`.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { languageStats } from './i18n.ts';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, '_site');
const env = process.env;
const readJson = <T>(p: string): T | null => { try { return JSON.parse(fs.readFileSync(p, 'utf8')) as T; } catch { return null; } };
const git = (...args: string[]): string | null => {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null; } catch { return null; }
};
const version = (pkg: string): string | null => readJson<{ version: string }>(path.join(ROOT, 'node_modules', pkg, 'package.json'))?.version ?? null;

if (!fs.existsSync(OUT)) { console.error('No _site/ yet: run `npm run build`.'); process.exit(2); }

// ---------------------------------------------------------------- code
interface Event { repository?: { private?: boolean; full_name?: string; html_url?: string }; head_commit?: { message?: string; timestamp?: string } }
const ci = env.GITHUB_ACTIONS === 'true';
const event = env.GITHUB_EVENT_PATH ? readJson<Event>(env.GITHUB_EVENT_PATH) : null;
const isPrivate = ci ? event?.repository?.private !== false : false;   // unknown in CI counts as private
const commit = env.GITHUB_SHA || git('rev-parse', 'HEAD');
const message = event?.head_commit?.message ?? git('log', '-1', '--format=%B');
const subject = message?.split('\n')[0] ?? null;
// "Merge pull request #18 from …" (merge) or "Title (#18)" (squash).
const pr = Number(subject?.match(/Merge pull request #(\d+)/)?.[1] ?? subject?.match(/\(#(\d+)\)\s*$/)?.[1]) || null;
const remote = git('config', '--get', 'remote.origin.url');
const repo = env.GITHUB_REPOSITORY || remote?.match(/github\.com[/:]([^/]+\/[^/.]+?)(\.git)?$/)?.[1] || null;
const server = env.GITHUB_SERVER_URL || 'https://github.com';
const repoUrl = repo ? `${server}/${repo}` : null;

const code = {
  builtAt: new Date().toISOString(),
  builtBy: ci ? 'GitHub Actions' : 'local build',
  public: ci ? !isPrivate : null,
  run: ci ? Number(env.GITHUB_RUN_NUMBER) || null : null,
  runUrl: ci && !isPrivate && repoUrl && env.GITHUB_RUN_ID ? `${repoUrl}/actions/runs/${env.GITHUB_RUN_ID}` : null,
  ...(isPrivate ? {} : {
    repo, repoUrl,
    branch: env.GITHUB_REF_NAME || git('rev-parse', '--abbrev-ref', 'HEAD'),
    commit,
    commitUrl: repoUrl && commit ? `${repoUrl}/commit/${commit}` : null,
    commitDate: event?.head_commit?.timestamp ?? git('log', '-1', '--format=%cI'),
    commitSubject: subject,
    pr,
    prUrl: repoUrl && pr ? `${repoUrl}/pull/${pr}` : null,
  }),
  tools: { node: process.version, astro: version('astro'), typescript: version('typescript'), linkedom: version('linkedom') },
};

// ---------------------------------------------------------------- site
const i18n = languageStats();
let files = 0;
let bytes = 0;
const byType: Record<string, { files: number; bytes: number }> = {};
for (const f of fs.readdirSync(OUT, { recursive: true }) as string[]) {
  const st = fs.statSync(path.join(OUT, f));
  if (!st.isFile()) continue;
  files++;
  bytes += st.size;
  const ext = path.extname(f).slice(1).toLowerCase() || '(none)';
  const t = (byType[ext] ??= { files: 0, bytes: 0 });
  t.files++; t.bytes += st.size;
}
const swVersion = fs.readFileSync(path.join(ROOT, 'public', 'sw.js'), 'utf8').match(/const VERSION = '([^']+)'/)?.[1] ?? null;
const config = readJson<{ site: string; base: string }>(path.join(ROOT, 'site.config.json'));
const site = {
  url: config ? config.site.replace(/\/$/, '') + (config.base || '').replace(/\/$/, '') : null,
  pages: i18n.english.pages,
  languages: i18n.languages.length + 1,
  files, bytes,
  byType: Object.fromEntries(Object.entries(byType).sort(([, a], [, b]) => b.bytes - a.bytes)),
  serviceWorker: swVersion,
};

fs.writeFileSync(path.join(OUT, 'stats.json'), JSON.stringify({ code, site, i18n }, null, 1) + '\n');
console.log(`stats.json: ${code.builtBy}${code.commit ? ` @ ${code.commit.slice(0, 7)}` : ''}${pr ? ` (PR #${pr})` : ''} · ${files} files, ${(bytes / 1048576).toFixed(1)} MB`);
