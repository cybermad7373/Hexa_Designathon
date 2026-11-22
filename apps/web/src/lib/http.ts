import { NextResponse } from "next/server";
import { toPublicError } from "./errors";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function fail(error: unknown, requestId?: string) {
  const result = toPublicError(error, requestId);
  return NextResponse.json(result.body, { status: result.status });
}
