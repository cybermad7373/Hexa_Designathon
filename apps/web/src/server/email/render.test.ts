import { describe, expect, it } from "vitest";
import { renderEmail } from "./render";

const appUrl = "http://localhost:3000";

describe("email templates", () => {
  it("renders the welcome email with a safe CTA", () => {
    const rendered = renderEmail("welcome", { name: "Ada", loginUrl: appUrl });

    expect(rendered.subject).toBe("Welcome to Hexa");
    expect(rendered.html).toContain("Welcome, Ada");
    expect(rendered.html).toContain(`href="${appUrl}"`);
    expect(rendered.text).toContain(appUrl);
  });

  it("renders the invitation email", () => {
    const rendered = renderEmail("workspace.invitation", {
      workspaceName: "Hexa Demo",
      inviterName: "Grace",
      acceptUrl: `${appUrl}/invite/abc`,
      expiresInHours: 48,
    });

    expect(rendered.subject).toBe("You're invited to Hexa Demo");
    expect(rendered.html).toContain("Grace invited you to Hexa Demo");
    expect(rendered.html).toContain("expires in 48 hours");
  });

  it("renders the role change email", () => {
    const rendered = renderEmail("member.role_changed", {
      workspaceName: "Hexa Demo",
      role: "ADMIN",
      changedByName: "Grace",
      workspaceUrl: `${appUrl}/w/hexa-demo`,
    });

    expect(rendered.subject).toContain("Hexa Demo");
    expect(rendered.html).toContain("changed your role to ADMIN");
  });

  it("renders the member removal email without a CTA", () => {
    const rendered = renderEmail("member.removed", {
      workspaceName: "Hexa Demo",
      removedByName: "Grace",
    });

    expect(rendered.subject).toBe("You were removed from Hexa Demo");
    expect(rendered.html).not.toContain("Open workspace");
  });

  it("renders the password reset email", () => {
    const rendered = renderEmail("password.reset", {
      name: "Ada",
      resetUrl: `${appUrl}/reset?token=secret`,
      expiresInMinutes: 30,
    });

    expect(rendered.subject).toBe("Reset your Hexa password");
    expect(rendered.html).toContain("expires in 30 minutes");
    expect(rendered.text).toContain("/reset?token=secret");
  });

  it("renders the activity digest with a preferences link", () => {
    const rendered = renderEmail("notification.digest", {
      name: "Ada",
      workspaceName: "Hexa Demo",
      summary: "3 tasks moved\n1 member joined",
      workspaceUrl: `${appUrl}/w/hexa-demo`,
      preferencesUrl: `${appUrl}/settings/email`,
    });

    expect(rendered.html).toContain("3 tasks moved<br>1 member joined");
    expect(rendered.html).toContain(`${appUrl}/settings/email`);
  });

  it("escapes user-controlled content", () => {
    const rendered = renderEmail("welcome", {
      name: "<script>alert(1)</script>",
      loginUrl: appUrl,
    });

    expect(rendered.html).not.toContain("<script>");
    expect(rendered.html).toContain("&lt;script&gt;");
  });

  it("strips CRLF from subject headers", () => {
    const rendered = renderEmail("workspace.invitation", {
      workspaceName: "Acme\r\nBcc: attacker@example.com",
      inviterName: "Grace",
      acceptUrl: `${appUrl}/invite/abc`,
      expiresInHours: 48,
    });

    expect(rendered.subject).not.toMatch(/[\r\n]/);
  });

  it("blocks non-http call-to-action URLs", () => {
    const rendered = renderEmail("welcome", {
      name: "Ada",
      loginUrl: "javascript:alert(1)",
    });

    expect(rendered.html).not.toContain("javascript:");
    expect(rendered.html).toContain('href="#"');
  });
});
