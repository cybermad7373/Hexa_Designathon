import { describe, expect, it } from "vitest";
import { AppError, ERROR_CODES, toPublicError } from "./errors";

describe("AppError", () => {
  it("uses the default status for a code", () => {
    const error = new AppError(ERROR_CODES.NOT_FOUND, "Workspace not found");

    expect(error.code).toBe("NOT_FOUND");
    expect(error.status).toBe(404);
    expect(error.expose).toBe(true);
  });

  it("allows an explicit status override", () => {
    const error = new AppError(ERROR_CODES.BAD_REQUEST, "Invalid cursor", { status: 422 });

    expect(error.status).toBe(422);
  });
});

describe("toPublicError", () => {
  it("serializes an exposed error with request id and details", () => {
    const error = new AppError(ERROR_CODES.FORBIDDEN, "Not allowed", {
      details: { reason: "role" },
    });

    const result = toPublicError(error, "req_123");

    expect(result.status).toBe(403);
    expect(result.body).toEqual({
      error: {
        code: "FORBIDDEN",
        message: "Not allowed",
        details: { reason: "role" },
        requestId: "req_123",
      },
    });
  });

  it("hides internal error messages", () => {
    const result = toPublicError(new Error("database password leaked"));

    expect(result.status).toBe(500);
    expect(result.body.error.code).toBe("INTERNAL");
    expect(result.body.error.message).not.toContain("password");
  });

  it("omits request id when it is not provided", () => {
    const result = toPublicError(new AppError(ERROR_CODES.CONFLICT, "Already exists"));

    expect(result.body.error).not.toHaveProperty("requestId");
  });

  it("includes request id on internal errors", () => {
    const result = toPublicError(new Error("boom"), "req_999");

    expect(result.status).toBe(500);
    expect(result.body.error.requestId).toBe("req_999");
  });
});
