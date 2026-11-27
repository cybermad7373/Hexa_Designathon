import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import {
  PERMISSIONS,
  ROLES,
  assertCan,
  assertCanAssignRole,
  assertCanRemoveMember,
  can,
  canAssignRole,
  canRemoveMember,
  permissionsFor,
  roleAtLeast,
} from "./rbac";

describe("RBAC permission matrix", () => {
  it("gives the owner every permission", () => {
    expect(permissionsFor("OWNER")).toHaveLength(PERMISSIONS.length);
    for (const permission of PERMISSIONS) {
      expect(can("OWNER", permission)).toBe(true);
    }
  });

  it("prevents a viewer from mutating anything", () => {
    expect(can("VIEWER", "project:read")).toBe(true);
    expect(can("VIEWER", "project:create")).toBe(false);
    expect(can("VIEWER", "member:invite")).toBe(false);
    expect(can("VIEWER", "workspace:update")).toBe(false);
  });

  it("lets a member create and update projects but not manage people or billing", () => {
    expect(can("MEMBER", "project:create")).toBe(true);
    expect(can("MEMBER", "project:update")).toBe(true);
    expect(can("MEMBER", "member:invite")).toBe(false);
    expect(can("MEMBER", "billing:read")).toBe(false);
    expect(can("MEMBER", "workspace:delete")).toBe(false);
  });

  it("lets an admin manage members and projects but not billing or workspace deletion", () => {
    expect(can("ADMIN", "member:invite")).toBe(true);
    expect(can("ADMIN", "member:update_role")).toBe(true);
    expect(can("ADMIN", "project:delete")).toBe(true);
    expect(can("ADMIN", "billing:read")).toBe(true);
    expect(can("ADMIN", "billing:manage")).toBe(false);
    expect(can("ADMIN", "workspace:delete")).toBe(false);
  });

  it("throws a forbidden error when a role lacks a permission", () => {
    expect(() => assertCan("VIEWER", "project:create")).toThrow(AppError);
    expect(() => assertCan("VIEWER", "project:create")).toThrow(
      "You do not have permission to perform this action.",
    );
  });

  it("allows assertCan when role has permission", () => {
    expect(() => assertCan("OWNER", "workspace:delete")).not.toThrow();
  });

  it("orders roles from viewer to owner", () => {
    expect(roleAtLeast("OWNER", "ADMIN")).toBe(true);
    expect(roleAtLeast("ADMIN", "ADMIN")).toBe(true);
    expect(roleAtLeast("MEMBER", "ADMIN")).toBe(false);
    expect(roleAtLeast("VIEWER", "MEMBER")).toBe(false);
  });

  it("covers every role", () => {
    for (const role of ROLES) {
      expect(permissionsFor(role).length).toBeGreaterThan(0);
    }
  });
});

describe("role escalation guards", () => {
  it("only lets an owner assign owner or admin", () => {
    expect(canAssignRole("OWNER", "OWNER")).toBe(true);
    expect(canAssignRole("OWNER", "ADMIN")).toBe(true);
    expect(canAssignRole("ADMIN", "ADMIN")).toBe(false);
    expect(canAssignRole("ADMIN", "OWNER")).toBe(false);
    expect(canAssignRole("ADMIN", "MEMBER")).toBe(true);
    expect(canAssignRole("MEMBER", "VIEWER")).toBe(false);
  });

  it("throws when an admin tries to assign an admin role", () => {
    expect(() => assertCanAssignRole("ADMIN", "ADMIN")).toThrow(AppError);
  });

  it("allows assertCanAssignRole when permitted", () => {
    expect(() => assertCanAssignRole("OWNER", "ADMIN")).not.toThrow();
    expect(() => assertCanAssignRole("ADMIN", "MEMBER")).not.toThrow();
  });

  it("protects the last owner from removal", () => {
    expect(canRemoveMember("OWNER", "OWNER", 1)).toBe(false);
    expect(canRemoveMember("OWNER", "OWNER", 2)).toBe(true);
    expect(() => assertCanRemoveMember("OWNER", "OWNER", 1)).toThrow(AppError);
  });

  it("lets an admin remove members and viewers but not peers", () => {
    expect(canRemoveMember("ADMIN", "MEMBER", 1)).toBe(true);
    expect(canRemoveMember("ADMIN", "VIEWER", 1)).toBe(true);
    expect(canRemoveMember("ADMIN", "ADMIN", 1)).toBe(false);
    expect(canRemoveMember("ADMIN", "OWNER", 2)).toBe(false);
    expect(canRemoveMember("MEMBER", "VIEWER", 1)).toBe(false);
  });

  it("assertCanRemoveMember throws for unauthorized removal", () => {
    expect(() => assertCanRemoveMember("MEMBER", "VIEWER", 1)).toThrow(AppError);
  });

  it("assertCanRemoveMember allows authorized removal", () => {
    expect(() => assertCanRemoveMember("ADMIN", "MEMBER", 1)).not.toThrow();
  });
});
