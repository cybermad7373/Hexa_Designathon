import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const appDir = join(root, "apps", "web");
const envPath = join(appDir, ".env");
const legacyEnvPath = join(root, ".env");
const examplePath = join(root, ".env.example");

if (!existsSync(examplePath)) {
  console.error("Missing .env.example. Are you running this from the repo root?");
  process.exit(1);
}

if (existsSync(envPath)) {
  console.log("apps/web/.env already exists. Leaving it untouched.");
} else if (existsSync(legacyEnvPath)) {
  copyFileSync(legacyEnvPath, envPath);
  console.log("Copied the existing root .env to apps/web/.env.");
} else {
  copyFileSync(examplePath, envPath);
  console.log("Created apps/web/.env from .env.example.");
}

console.log(`
Next steps:
  1. npm install
  2. npm run db:up          # Postgres + Redis + Mailpit via Docker
  3. npm run db:push        # sync the Prisma schema
  4. npm run db:seed        # demo user, workspace, and welcome email
  5. npm run dev            # http://localhost:3000
  6. npm run email:process  # deliver queued email to Mailpit (localhost:8025)

Verify your machine any time with: npm run verify
`);
