// SPDX-License-Identifier: MIT
// gta6-meme-x-01 entry program (kanbara12).
//
// The entry itself is a post on X, not this program. All the grader
// needs from this repository is the post's address, kept in POST.json
// at the repository root. This program carries that file into the
// output directory the grader reads. It stays inside the Node
// standard library, never touches the network, never reads the clock,
// and stays quiet when it succeeds, so every run lands the same way.
//
// Before copying, it checks the address really is a single public
// post: https, an X host, and a /handle/status/<digits> path. A bad
// address fails loudly instead of being handed to the grader.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const POST_FILE = "POST.json";
const POST_HOSTS = ["x.com", "twitter.com"];
const STATUS_PATH = /^\/[^/]+\/status\/[0-9]+$/;

function envDir(name: string, fallback: string): string {
  const value = process.env[name];
  if (value !== undefined && value !== "") {
    return value;
  }
  return fallback;
}

function botRoot(): string {
  return envDir("MAKEFUN_BOT_DIR", dirname(fileURLToPath(import.meta.url)));
}

function outputRoot(): string {
  return envDir("MAKEFUN_OUTPUT_DIR", "out");
}

function loadPost(root: string): string {
  return readFileSync(join(root, POST_FILE), "utf8");
}

function postUrl(text: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("POST.json is not valid JSON");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("POST.json must hold an object with a url");
  }
  const url = (parsed as { url?: unknown }).url;
  if (typeof url !== "string" || url === "") {
    throw new Error("POST.json must hold a non-empty url string");
  }
  let address: URL;
  try {
    address = new URL(url);
  } catch {
    throw new Error("POST.json url must parse as a URL");
  }
  if (address.protocol !== "https:") {
    throw new Error("POST.json url must use https");
  }
  if (!POST_HOSTS.includes(address.hostname)) {
    throw new Error("POST.json url must point at x.com");
  }
  if (!STATUS_PATH.test(address.pathname)) {
    throw new Error("POST.json url must be a post address (/handle/status/<id>)");
  }
  return url;
}

function placePost(root: string, target: string, text: string): void {
  postUrl(text);
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, POST_FILE), text);
}

function main(): void {
  const text = loadPost(botRoot());
  placePost(botRoot(), outputRoot(), text);
}

main();
