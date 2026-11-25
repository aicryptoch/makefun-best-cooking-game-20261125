// main.ts — entrypoint for the Dim Sum Harbor submission.
// Running `node main.ts` assembles the entry in the output directory:
// it copies the playable game (game/) and the screenshot set
// (screenshots/) across, then stamps the folder with the dossier the
// bounty scorer expects, produced by the vendored make.fun library.
// The output directory comes from MAKEFUN_OUTPUT_DIR, defaulting to
// ./out next to this file.

import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || join(here, 'out');

mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'game'), join(outDir, 'game'), { recursive: true });
cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`dim sum harbor entry assembled in ${outDir}`);
