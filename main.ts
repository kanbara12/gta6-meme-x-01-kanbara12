// SPDX-License-Identifier: MIT
// Entry program for the gta6-meme-x-01 bounty (kanbara12).
//
// The entry is a post on X. The grader only needs one fact from this
// repository: the post's address, which lives in POST.json at the root.
// This program copies that file into the output directory the grader
// reads, and nothing else. It uses only the Node standard library, it
// makes no network requests, it reads no clock, and it prints nothing
// on success, so repeated runs produce the same bytes every time.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const POST_FILENAME = "POST.json";

function repoRoot(): string {
  const fromEnv = process.env.MAKEFUN_BOT_DIR;
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return dirname(fileURLToPath(import.meta.url));
}

function outDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return "out";
}

function readPost(root: string): string {
  return readFileSync(join(root, POST_FILENAME), "utf8");
}

function checkPost(text: string): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("POST.json is not valid JSON");
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("POST.json must hold an object");
  }
  const url = (parsed as { url?: unknown }).url;
  if (typeof url !== "string" || url === "") {
    throw new Error("POST.json must hold a url string");
  }
  let address: URL;
  try {
    address = new URL(url);
  } catch {
    throw new Error("POST.json url must be a valid URL");
  }
  if (address.protocol !== "https:") {
    throw new Error("POST.json url must use https");
  }
  if (address.hostname !== "x.com" && address.hostname !== "twitter.com") {
    throw new Error("POST.json url must point at x.com");
  }
}

function main(): void {
  const root = repoRoot();
  const target = outDir();
  const text = readPost(root);
  checkPost(text);
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, POST_FILENAME), text);
}

main();
