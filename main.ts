// gta6-meme-x-01 — entry program (Node 22, standard library only).
//
// The entry is the X post itself: the house reads the post from X and
// hands its first picture and its text to the judge. This program only
// carries POST.json (the post's address) from the repository into the
// output directory, where the gate reads it. It checks the address is
// shaped like an X post first, so a mistyped URL fails here — before
// submission — instead of at the gate.
//
// Local run, the way the grader does it:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repoDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(repoDir, "POST.json");
const target = join(outDir, "POST.json");

// An X post address, as the gate reads one: https://x.com/<handle>/status/<id>
// (or twitter.com, with www. or mobile. in front, /status/ or /statuses/
// after the handle, or /i/web/status/<id> with no handle; the id digits
// only; a query or fragment after it is read past).
const POST_URL =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/(?:[^/]+\/(?:status|statuses)|i\/web\/status)\/\d+([?#].*)?$/;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

let post: unknown;
try {
  post = JSON.parse(readFileSync(source, "utf8"));
} catch (error) {
  fail(`cannot read ${source}: ${(error as Error).message}`);
}

if (typeof post !== "object" || post === null) {
  fail(`${source} must be a JSON object with a string "url"`);
}
const url = (post as { url?: unknown }).url;
if (typeof url !== "string" || !POST_URL.test(url)) {
  fail(
    `${source} "url" must be an X post address like https://x.com/<handle>/status/<id>`,
  );
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, JSON.stringify(post) + "\n", "utf8");
console.log(`wrote ${target}`);
