import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const checks = [];

function run(command) {
  try {
    return execSync(command, { stdio: ["ignore", "pipe", "ignore"], encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function check(name, status, detail) {
  checks.push({ name, status, detail });
}

const nodeVersion = process.versions.node;
const [nodeMajor, nodeMinor] = nodeVersion.split(".").map(Number);
const nodeOk = nodeMajor > 22 || (nodeMajor === 22 && nodeMinor >= 12);
check("Node.js >= 22.12", nodeOk ? "pass" : "fail", `v${nodeVersion}`);

const npmVersion = run("npm --version");
check("npm", npmVersion ? "pass" : "fail", npmVersion ?? "not found");

const gitVersion = run("git --version");
check("git", gitVersion ? "pass" : "fail", gitVersion ?? "not found");

const dockerVersion = run("docker --version");
check(
  "Docker (optional for local DB)",
  dockerVersion ? "pass" : "warn",
  dockerVersion ?? "not found",
);

const dockerRunning = run('docker info --format "{{.ServerVersion}}"');
check(
  "Docker daemon running",
  dockerRunning ? "pass" : "warn",
  dockerRunning ? `server ${dockerRunning}` : "start Docker Desktop before npm run db:up",
);

const hasEnv = existsSync(join(root, "apps", "web", ".env"));
check("apps/web/.env", hasEnv ? "pass" : "warn", hasEnv ? "present" : "run npm run setup");

const hasDependencies = existsSync(join(root, "node_modules"));
check(
  "Dependencies installed",
  hasDependencies ? "pass" : "fail",
  hasDependencies ? "node_modules present" : "run npm install",
);

const envLocal = join(root, "apps", "web", ".env");
const hasPrismaClient = existsSync(join(root, "node_modules", ".prisma", "client"));
check(
  "Prisma client generated",
  hasPrismaClient ? "pass" : "fail",
  hasPrismaClient ? "present" : "run npm install or npx prisma generate",
);

if (existsSync(envLocal)) {
  check(".env readable", "pass", envLocal);

  const envFile = readFileSync(envLocal, "utf8");
  const has = (key) => new RegExp(`^${key}=.+`, "m").test(envFile);
  check(
    "Email config",
    has("EMAIL_PROVIDER") && has("EMAIL_FROM") && has("SMTP_URL") ? "pass" : "warn",
    "EMAIL_PROVIDER, EMAIL_FROM, and SMTP_URL",
  );
  check(
    "Cron secret",
    has("CRON_SECRET") ? "pass" : "warn",
    has("CRON_SECRET") ? "configured" : "set CRON_SECRET before npm run email:process",
  );
}

const width = Math.max(...checks.map((item) => item.name.length));
console.log("\nHexa Designathon environment check\n");
for (const item of checks) {
  const icon = item.status === "pass" ? "OK  " : item.status === "warn" ? "WARN" : "FAIL";
  console.log(`  ${icon}  ${item.name.padEnd(width)}  ${item.detail}`);
}

const failures = checks.filter((item) => item.status === "fail").length;
const warnings = checks.filter((item) => item.status === "warn").length;
console.log(
  `\n${checks.length - failures - warnings} passed, ${warnings} warnings, ${failures} failures.`,
);
if (failures > 0) {
  console.log("Fix failures above, then re-run: npm run verify\n");
  process.exit(1);
}
console.log("Ready. Read docs/PREREQUISITES.md for the full day-of checklist.\n");
