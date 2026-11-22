import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { fail } from "@/lib/http";
import { processEmailQueue } from "@/server/email/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request: Request): boolean {
  if (!env.CRON_SECRET) {
    return false;
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const expected = Buffer.from(env.CRON_SECRET);
  const actual = Buffer.from(token);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  if (!env.CRON_SECRET) {
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.INTERNAL,
          message: "Email queue is unavailable.",
          requestId,
        },
      },
      { status: 503, headers: { "cache-control": "no-store", "x-request-id": requestId } },
    );
  }

  if (!isAuthorized(request)) {
    return fail(new AppError(ERROR_CODES.UNAUTHORIZED, "Unauthorized"), requestId);
  }

  const result = await processEmailQueue(50);

  return NextResponse.json(
    { data: result },
    { headers: { "cache-control": "no-store", "x-request-id": requestId } },
  );
}
