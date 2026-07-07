import { Prisma } from "@prisma/client";

const RECOVERABLE_CONNECTION_CODES = new Set(["P1001", "P1002", "P1017"]);

/** True when PostgreSQL closed or refused the connection (Neon cold start, idle timeout). */
export function isRecoverableConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return RECOVERABLE_CONNECTION_CODES.has(error.code);
  }
  return error instanceof Prisma.PrismaClientInitializationError;
}
