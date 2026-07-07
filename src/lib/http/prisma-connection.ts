import { Prisma, isRecoverableConnectionError } from "@white-shop/db";

/**
 * True when Prisma cannot reach PostgreSQL (Neon paused, wrong URL, network, etc.).
 */
export function isPrismaConnectionError(error: unknown): boolean {
  return isRecoverableConnectionError(error);
}

export function prismaConnectionFailureCode(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code;
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return error.errorCode ?? "initialization";
  }
  return "unknown";
}

/** Redacts postgres URLs from Prisma messages before logging. */
export function redactDatabaseUrls(message: string): string {
  return message.replace(/postgres(?:ql)?:\/\/[^\s'"]+/gi, "[REDACTED]");
}
