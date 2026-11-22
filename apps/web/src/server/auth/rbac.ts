import { AppError, ERROR_CODES } from "@/lib/errors";

export const ROLES = ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "workspace:read",
  "workspace:update",
  "workspace:delete",
  "member:read",
  "member:invite",
  "member:update_role",
  "member:remove",
  "billing:read",
  "billing:manage",
  "project:read",
  "project:create",
  "project:update",
  "project:delete",
  "audit:read",
  "email:send",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ROLE_RANK: Record<Role, number> = {
  VIEWER: 1,
  MEMBER: 2,
  ADMIN: 3,
  OWNER: 4,
};

const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  OWNER: new Set(PERMISSIONS),
  ADMIN: new Set<Permission>([
    "workspace:read",
    "workspace:update",
    "member:read",
    "member:invite",
    "member:update_role",
    "member:remove",
    "billing:read",
    "project:read",
    "project:create",
    "project:update",
    "project:delete",
    "audit:read",
    "email:send",
  ]),
  MEMBER: new Set<Permission>([
    "workspace:read",
    "member:read",
    "project:read",
    "project:create",
    "project:update",
  ]),
  VIEWER: new Set<Permission>(["workspace:read", "member:read", "project:read"]),
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

export function assertCan(role: Role, permission: Permission): void {
  if (!can(role, permission)) {
    throw new AppError(ERROR_CODES.FORBIDDEN, "You do not have permission to perform this action.");
  }
}

export function roleAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function canAssignRole(actorRole: Role, targetRole: Role): boolean {
  if (actorRole === "OWNER") {
    return true;
  }

  if (actorRole === "ADMIN") {
    return targetRole === "MEMBER" || targetRole === "VIEWER";
  }

  return false;
}

export function assertCanAssignRole(actorRole: Role, targetRole: Role): void {
  if (!canAssignRole(actorRole, targetRole)) {
    throw new AppError(ERROR_CODES.FORBIDDEN, "You cannot assign that role.");
  }
}

export function canRemoveMember(actorRole: Role, targetRole: Role, ownerCount: number): boolean {
  if (targetRole === "OWNER" && ownerCount <= 1) {
    return false;
  }

  if (actorRole === "OWNER") {
    return true;
  }

  if (actorRole === "ADMIN") {
    return targetRole === "MEMBER" || targetRole === "VIEWER";
  }

  return false;
}

export function assertCanRemoveMember(actorRole: Role, targetRole: Role, ownerCount: number): void {
  if (!canRemoveMember(actorRole, targetRole, ownerCount)) {
    throw new AppError(ERROR_CODES.FORBIDDEN, "You cannot remove this member.");
  }
}

export function permissionsFor(role: Role): readonly Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}
