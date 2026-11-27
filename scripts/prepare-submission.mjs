import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const target = join(root, "agent-prompts");
const self = join(root, "scripts", "prepare-submission.mjs");
const skip = new Set(["node_modules", ".git", ".next", "artifacts", "coverage"]);

function files(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files(full, found);
    } else if (/\.(md|tsx|ts|mjs|json)$/.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

function stripMarkdown(text) {
  return text
    .replace(/ · Source: `agent-prompts\/[^`]+`/g, "")
    .replace(/Next: `agent-prompts\/[^`]+` → `([^`]+)`/g, "Next: `$1`")
    .replace(/^.*`agent-prompts\/[^`]+` is open\.\s*$/gm, "")
    .replace(
      /├── agent-prompts\/\n│   ├── MASTER-WORKFLOW\.md[^\n]*\n│   └── 00–10 phase prompts[^\n]*\n/g,
      "",
    )
    .replace(
      /^The full runbook is \[agent-prompts\/MASTER-WORKFLOW\.md\][^\n]*\n\[agent-prompts\/\][^\n]*\n/gm,
      "",
    )
    .replace(
      /^2\. Read `agent-prompts\/MASTER-WORKFLOW\.md` end to end\.$/m,
      "2. Follow the phase gates recorded in `docs/discovery/README.md`.",
    )
    .replace(
      /^Run `agent-prompts\/MASTER-WORKFLOW\.md`\. That prompt is the source of truth for phase order, gates, and\nartifact formats\. This file is the standing contract; the master workflow is the runbook\.$/m,
      "Follow the phase gates in `docs/discovery/README.md`. This file is the standing contract.",
    )
    .split("\n")
    .filter((line) => !line.includes("agent-prompts/"))
    .join("\n");
}

function stripCode(text) {
  return text.replaceAll("agent-prompts/", "docs/discovery/");
}

if (!existsSync(target)) {
  console.log("agent-prompts/ is already absent.");
} else {
  rmSync(target, { recursive: true, force: true });
  console.log("Removed agent-prompts/.");
}

let changed = 0;
for (const file of files(root)) {
  if (file === self) continue;
  const before = readFileSync(file, "utf8");
  if (!before.includes("agent-prompts")) continue;
  const after = file.endsWith(".md") ? stripMarkdown(before) : stripCode(before);
  if (after === before) continue;
  writeFileSync(file, after, "utf8");
  changed += 1;
}

const leftovers = files(root)
  .filter((file) => file !== self && readFileSync(file, "utf8").includes("agent-prompts"))
  .map((file) => relative(root, file));

mkdirSync(join(root, "artifacts"), { recursive: true });
writeFileSync(
  join(root, "artifacts", "submission-cleanup.txt"),
  `Timestamp: ${new Date().toISOString()}\nRemoved agent-prompts/: yes\nFiles updated: ${changed}\nRemaining references: ${leftovers.length}\n${leftovers.map((item) => `- ${item}`).join("\n")}\n`,
  "utf8",
);

if (existsSync(target) || leftovers.length > 0) {
  console.error(`Cleanup incomplete. Remaining references:\n${leftovers.join("\n")}`);
  process.exit(1);
}

console.log(`Updated ${changed} files. No dangling runbook references remain.`);
console.log("Commit the deletions, push, then submit. Evidence: artifacts/submission-cleanup.txt");
