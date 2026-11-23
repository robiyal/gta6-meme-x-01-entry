// main.ts — copies POST.json from the repository root to the harness output
// directory. That is all this program does: the house reads the post itself
// from X and builds the dossier the judge sees.
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// The grader runs this program twice on the same repository; the copy is
// deterministic, so both runs write identical bytes.
const botDir = process.env.MAKEFUN_BOT_DIR ?? '.';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(join(botDir, 'POST.json'), join(outDir, 'POST.json'));
