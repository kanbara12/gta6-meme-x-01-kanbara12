// SPDX-License-Identifier: MIT
// Entry program for the gta6-meme-x-01 bounty (kanbara12).
//
// It does exactly one thing: copy POST.json from this repository into
// the output directory the grader reads. It touches no network, reads
// no clock, and writes no other file, so repeated runs produce the
// same bytes every time.

import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The repository root: the bot directory when the grader sets it,
// otherwise the folder this file lives in.
const repoRoot = process.env.MAKEFUN_BOT_DIR
  ? process.env.MAKEFUN_BOT_DIR
  : dirname(fileURLToPath(import.meta.url));

// The grader's output directory, defaulting to a local "out" folder.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

mkdirSync(outDir, { recursive: true });
copyFileSync(join(repoRoot, "POST.json"), join(outDir, "POST.json"));

// Deliberately silent on success: the grader expects no output.
