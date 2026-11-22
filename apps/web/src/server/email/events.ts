export const EMAIL_EVENTS = [
  "welcome",
  "workspace.invitation",
  "member.role_changed",
  "member.removed",
  "password.reset",
  "notification.digest",
] as const;

export type EmailEvent = (typeof EMAIL_EVENTS)[number];

export type EmailCategory = "transactional" | "product" | "marketing";

export type EmailPayloads = {
  welcome: {
    name: string;
    loginUrl: string;
  };
  "workspace.invitation": {
    workspaceName: string;
    inviterName: string;
    acceptUrl: string;
    expiresInHours: number;
  };
  "member.role_changed": {
    workspaceName: string;
    role: string;
    changedByName: string;
    workspaceUrl: string;
  };
  "member.removed": {
    workspaceName: string;
    removedByName: string;
  };
  "password.reset": {
    name: string;
    resetUrl: string;
    expiresInMinutes: number;
  };
  "notification.digest": {
    name: string;
    workspaceName: string;
    summary: string;
    workspaceUrl: string;
    preferencesUrl: string;
  };
};

export const EMAIL_CATEGORIES: Record<EmailEvent, EmailCategory> = {
  welcome: "product",
  "workspace.invitation": "transactional",
  "member.role_changed": "transactional",
  "member.removed": "transactional",
  "password.reset": "transactional",
  "notification.digest": "product",
};

export function isEmailEvent(value: string): value is EmailEvent {
  return (EMAIL_EVENTS as readonly string[]).includes(value);
}
