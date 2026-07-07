#!/usr/bin/env node
/**
 * Loads monorepo root `.env` then runs Prisma CLI.
 * Prisma only auto-loads `.env` next to schema/cwd — not the repo root.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DB_DIR = path.join(__dirname, "..");
const ROOT_ENV = path.join(DB_DIR, "..", "..", ".env");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(ROOT_ENV);

const prismaArgs = process.argv.slice(2);
if (prismaArgs.length === 0) {
  console.error("Usage: node run-with-root-env.cjs <prisma-subcommand> [...args]");
  process.exit(1);
}

const result = spawnSync("prisma", prismaArgs, {
  cwd: DB_DIR,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
