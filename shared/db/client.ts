import { Prisma, PrismaClient } from "@prisma/client";
import { isRecoverableConnectionError } from "./connection-errors";
import { createQuerySemaphore, type QuerySemaphore } from "./query-semaphore";

declare global {
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

const DEFAULT_DEV_CONNECTION_LIMIT = "8";
const DEFAULT_MAX_CONCURRENT_QUERIES = 8;

// Neon suspends idle compute after ~5 min ("scale to zero"); the next query then
// pays a multi-second cold-start. Ping just under that window to keep it awake.
const DB_KEEP_WARM_INTERVAL_MS = 4 * 60 * 1000;

function appendQueryParam(url: string, key: string, value: string): string {
  const lower = url.toLowerCase();
  if (lower.includes(`${key.toLowerCase()}=`)) {
    return url;
  }
  return url.includes("?") ? `${url}&${key}=${value}` : `${url}?${key}=${value}`;
}

/**
 * Append libpq params if missing: UTF-8 + bounded connect wait (faster fail than default).
 * Neon/Vercel: ensure TLS; Prisma + Neon transaction pooler needs `pgbouncer=true`.
 */
function augmentDatabaseUrl(raw: string): string {
  if (!raw) return raw;
  let u = raw;
  u = appendQueryParam(u, "client_encoding", "UTF8");
  u = appendQueryParam(u, "connect_timeout", "12");
  const lower = u.toLowerCase();
  if ((lower.includes(".neon.tech") || lower.includes("neon.tech")) && !lower.includes("sslmode=")) {
    u = appendQueryParam(u, "sslmode", "require");
  }
  const lowerAfterSsl = u.toLowerCase();
  if ((u.includes("-pooler") || lowerAfterSsl.includes("pooler.")) && !lowerAfterSsl.includes("pgbouncer=")) {
    u = appendQueryParam(u, "pgbouncer", "true");
  }

  if (!lowerAfterSsl.includes("connection_limit=")) {
    const connectionLimit =
      process.env.PRISMA_CONNECTION_LIMIT?.trim() ||
      process.env.DATABASE_CONNECTION_LIMIT?.trim() ||
      (process.env.NODE_ENV === "development" ? DEFAULT_DEV_CONNECTION_LIMIT : "");
    if (connectionLimit) {
      u = appendQueryParam(u, "connection_limit", connectionLimit);
    }
  }

  return u;
}

const databaseUrl = process.env.DATABASE_URL || "";
process.env.DATABASE_URL = augmentDatabaseUrl(databaseUrl);

const devPrismaLogs =
  process.env.NODE_ENV === "development" && process.env.PRISMA_LOG_QUERIES === "1"
    ? (["query", "error", "warn"] as const)
    : (["error", "warn"] as const);

function resolveMaxConcurrentQueries(): number {
  const raw = process.env.PRISMA_MAX_CONCURRENT_QUERIES?.trim();
  if (!raw) {
    return DEFAULT_MAX_CONCURRENT_QUERIES;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_CONCURRENT_QUERIES;
}

async function runWithConnectionRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isRecoverableConnectionError(error)) {
      throw error;
    }
    await resetDbConnection();
    return operation();
  }
}

function extendClientWithSemaphore(base: PrismaClient, semaphore: QuerySemaphore): PrismaClient {
  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          return semaphore.run(() => runWithConnectionRetry(() => query(args)));
        },
      },
    },
    client: {
      async $queryRaw<T = unknown>(
        query: TemplateStringsArray | Prisma.Sql,
        ...values: unknown[]
      ): Promise<T> {
        return semaphore.run(() =>
          runWithConnectionRetry(() => base.$queryRaw<T>(query, ...values))
        );
      },
      async $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T> {
        return semaphore.run(() =>
          runWithConnectionRetry(() => base.$queryRawUnsafe<T>(query, ...values))
        );
      },
      async $executeRaw(
        query: TemplateStringsArray | Prisma.Sql,
        ...values: unknown[]
      ): Promise<number> {
        return semaphore.run(() =>
          runWithConnectionRetry(() => base.$executeRaw(query, ...values))
        );
      },
      async $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number> {
        return semaphore.run(() =>
          runWithConnectionRetry(() => base.$executeRawUnsafe(query, ...values))
        );
      },
    },
  }) as unknown as PrismaClient;
}

function createPrismaClient(): PrismaClient {
  const base = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? [...devPrismaLogs] : ["error"],
    errorFormat: "pretty",
  });
  const semaphore = createQuerySemaphore(resolveMaxConcurrentQueries());

  return extendClientWithSemaphore(base, semaphore);
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client per serverless isolate (Vercel/Next) and across dev HMR.
globalForPrisma.prisma = db;

let dbReadyPromise: Promise<void> | null = null;
let dbResetPromise: Promise<void> | null = null;

/** Opens the first pool connection — reduces Neon cold-start latency on first request. */
export function ensureDbReady(): Promise<void> {
  if (!dbReadyPromise) {
    dbReadyPromise = db.$connect().catch((error: unknown) => {
      dbReadyPromise = null;
      throw error;
    });
  }
  return dbReadyPromise;
}

/**
 * Drops stale pool connections and reconnects.
 * Coalesces concurrent resets (e.g. many queries failing with P1017 at once).
 */
export function resetDbConnection(): Promise<void> {
  if (dbResetPromise) {
    return dbResetPromise;
  }

  dbResetPromise = (async () => {
    dbReadyPromise = null;
    try {
      await db.$disconnect();
    } catch {
      // Ignore disconnect errors on already-closed connections.
    }
    await ensureDbReady();
  })().finally(() => {
    dbResetPromise = null;
  });

  return dbResetPromise;
}

let keepWarmTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Keeps the Neon compute awake by pinging it just under the auto-suspend window,
 * eliminating multi-second cold-start latency on the first request of a session.
 *
 * Enabled in development by default; in production opt in with `DB_KEEP_WARM=1`
 * (only for always-on Node hosts — on serverless prefer raising Neon's suspend
 * timeout, since intervals do not survive across function invocations).
 */
export function startDbKeepWarm(): void {
  if (keepWarmTimer) {
    return;
  }

  const flag = process.env.DB_KEEP_WARM;
  const enabled =
    flag === "1" || (flag !== "0" && process.env.NODE_ENV === "development");
  if (!enabled) {
    return;
  }

  keepWarmTimer = setInterval(() => {
    void db.$queryRaw`SELECT 1`.catch(() => {
      // Best-effort: a missed ping only means the next real query pays wake cost.
    });
  }, DB_KEEP_WARM_INTERVAL_MS);

  // Never hold the process open solely for the heartbeat.
  keepWarmTimer.unref?.();
}
