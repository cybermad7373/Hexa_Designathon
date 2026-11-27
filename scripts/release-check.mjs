import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const flags = new Set(process.argv.slice(2));
const shell = process.platform === "win32";
const startedAt = new Date();

const steps = [
  { id: "format", label: "Format check", args: ["run", "format:check"] },
  { id: "lint", label: "Lint", args: ["run", "lint"] },
  { id: "typecheck", label: "Typecheck", args: ["run", "typecheck"] },
  { id: "unit", label: "Unit tests", args: ["run", "test"] },
  { id: "coverage", label: "Unit test coverage (>= 95%)", args: ["run", "test:coverage"] },
  {
    id: "build",
    label: "Production build",
    args: ["run", "build"],
    skip: flags.has("--skip-build"),
  },
  {
    id: "e2e",
    label: "End-to-end tests",
    args: ["run", "test:e2e"],
    skip: flags.has("--skip-e2e"),
    hint: "Install browsers once with: npx playwright install chromium",
  },
  {
    id: "audit",
    label: "Production dependency audit",
    args: ["audit", "--omit=dev", "--audit-level=high"],
    skip: flags.has("--skip-audit"),
  },
];

function capture(command, args) {
  const result = spawnSync([command, ...args].join(" "), {
    cwd: root,
    encoding: "utf8",
    shell,
  });
  return result.status === 0 ? (result.stdout ?? "").trim() : null;
}

const commit = capture("git", ["rev-parse", "--short", "HEAD"]) ?? "unknown";
const branch = capture("git", ["rev-parse", "--abbrev-ref", "HEAD"]) ?? "unknown";
const results = [];

console.log("\nHexa release gate");
console.log(`Commit ${commit} on ${branch}`);
console.log("No new features after this point. Fix blockers only.\n");

for (const step of steps) {
  if (step.skip) {
    console.log(`SKIP  ${step.label}`);
    results.push({ ...step, status: "skipped", durationMs: 0 });
    continue;
  }

  console.log(`\n>>> ${step.label}`);
  const start = performance.now();
  const result = spawnSync(["npm", ...step.args].join(" "), {
    cwd: root,
    stdio: "inherit",
    shell,
  });
  const durationMs = Math.round(performance.now() - start);
  const passed = result.status === 0;

  results.push({ ...step, status: passed ? "pass" : "fail", durationMs });

  if (!passed && step.hint) {
    console.log(`\nHint: ${step.hint}`);
  }
}

const failed = results.filter((step) => step.status === "fail");
const passed = results.filter((step) => step.status === "pass");
const skipped = results.filter((step) => step.status === "skipped");
const totalMs = Date.now() - startedAt.getTime();

const rows = results
  .map((step) => {
    const icon = step.status === "pass" ? "PASS" : step.status === "fail" ? "FAIL" : "SKIP";
    return `| ${icon} | ${step.label} | ${(step.durationMs / 1000).toFixed(1)}s |`;
  })
  .join("\n");

const report = `# Release check

- Timestamp: ${startedAt.toISOString()}
- Commit: \`${commit}\`
- Branch: \`${branch}\`
- Node: \`${process.version}\`
- Result: **${failed.length === 0 ? "READY" : "BLOCKED"}**
- Duration: ${(totalMs / 1000).toFixed(1)}s

| Status | Check | Time |
| --- | --- | --- |
${rows}

${failed.length === 0 ? "All required checks passed. Deploy, smoke the deployed URL, then rehearse the demo twice." : `Blockers:\n${failed.map((step) => `- ${step.label}${step.hint ? ` (${step.hint})` : ""}`).join("\n")}`}
`;

mkdirSync(join(root, "artifacts"), { recursive: true });
writeFileSync(join(root, "artifacts", "release-report.md"), report, "utf8");
writeFileSync(
  join(root, "artifacts", "release-report.json"),
  JSON.stringify(
    {
      timestamp: startedAt.toISOString(),
      commit,
      branch,
      node: process.version,
      ready: failed.length === 0,
      durationMs: totalMs,
      results: results.map(({ id, label, status, durationMs: ms }) => ({
        id,
        label,
        status,
        durationMs: ms,
      })),
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`\n${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped.`);
console.log(`Report: artifacts/release-report.md\n`);

if (failed.length > 0) {
  console.log("Release gate is BLOCKED. Fix only the failures above, then re-run.\n");
  process.exit(1);
}

console.log("Release gate is READY. Deploy, smoke the URL, rehearse the demo.\n");
