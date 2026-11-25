// Entry for make.fun: "Make the AI Judge Feel Nostalgic: A Childhood Memory".
// Reads the single nostalgic sentence from line.txt next to this file and
// emits it verbatim as /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt),
// with no trailing newline, so the sealed scorer sees exactly one line.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 280;

function fail(message: string): never {
  throw new Error(`nostalgic-01: ${message}`);
}

const scriptDir = new URL(".", import.meta.url).pathname, raw = readFileSync(join(scriptDir, "line.txt"), "utf8");
const sentence = raw.trim();

if (sentence.length < 1) fail("line.txt is empty");
if (sentence.length > MAX_CHARS) {
  fail(`line is ${sentence.length} chars, over the ${MAX_CHARS} limit`);
}
if (/[\r\n]/.test(sentence)) fail("line must not contain a newline");
const terminators = sentence.match(/[.!?]/g) ?? [];
if (terminators.length !== 1 || !/[.!?]$/.test(sentence)) {
  fail("line must be exactly one sentence ending in . ! or ?");
}

const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(targetDir, { recursive: true });
writeFileSync(join(targetDir, "entry.txt"), sentence, "utf8");
console.log(sentence);
