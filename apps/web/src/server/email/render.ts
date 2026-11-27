import { EMAIL_CATEGORIES, type EmailEvent, type EmailPayloads } from "./events";

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const BRAND = {
  canvas: "#f8f8f9",
  surface: "#ffffff",
  line: "#cbd0e5",
  fg: "#040d43",
  muted: "#535983",
  brand: "#3c2cda",
  brandInk: "#ffffff",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeader(value: string): string {
  return value
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 200);
}

function safeUrl(value: string): string {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? escapeHtml(trimmed) : "#";
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;font:400 15px/1.65 Arial,Helvetica,sans-serif;color:${BRAND.muted};">${escapeHtml(text)}</p>`;
}

function layout({
  preview,
  heading,
  body,
  cta,
  footer,
}: {
  preview: string;
  heading: string;
  body: string;
  cta?: { label: string; url: string };
  footer?: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.canvas};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.canvas};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${BRAND.surface};border:1px solid ${BRAND.line};border-radius:16px;overflow:hidden;">
<tr><td style="padding:22px 28px;border-bottom:1px solid ${BRAND.line};font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.muted};">HEXA / DESIGNATHON OS</td></tr>
<tr><td style="padding:32px 28px;">
<h1 style="margin:0 0 18px;font:600 24px/1.25 Arial,Helvetica,sans-serif;letter-spacing:-0.02em;color:${BRAND.fg};">${escapeHtml(heading)}</h1>
${body}
${
  cta
    ? `<a href="${safeUrl(cta.url)}" style="display:inline-block;margin-top:10px;padding:12px 20px;border-radius:999px;background-color:${BRAND.brand};color:${BRAND.brandInk};font:600 14px/1 Arial,Helvetica,sans-serif;text-decoration:none;">${escapeHtml(cta.label)}</a>`
    : ""
}
</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid ${BRAND.line};font:12px/1.6 Arial,Helvetica,sans-serif;color:${BRAND.muted};">${escapeHtml(footer ?? "Sent by Hexa.")}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function footerFor(event: EmailEvent): string {
  return EMAIL_CATEGORIES[event] === "transactional"
    ? "This is a transactional message about your account."
    : "You are receiving this because of your workspace notification settings.";
}

type Renderers = {
  [K in EmailEvent]: (payload: EmailPayloads[K]) => RenderedEmail;
};

const renderers: Renderers = {
  welcome: ({ name, loginUrl }) => {
    const heading = `Welcome, ${name}`;
    const body = [
      paragraph(
        "Your Hexa workspace is ready. Open the app to see the current mission and the next gate.",
      ),
      paragraph("If the button does not work, paste the link from this email into your browser."),
    ].join("");

    return {
      subject: sanitizeHeader("Welcome to Hexa"),
      html: layout({
        preview: "Your workspace is ready.",
        heading,
        body,
        cta: { label: "Open Hexa", url: loginUrl },
        footer: footerFor("welcome"),
      }),
      text: `Welcome, ${name}\n\nYour Hexa workspace is ready. Open the app: ${loginUrl}\n\nYou are receiving this because of your workspace notification settings.\n`,
    };
  },

  "workspace.invitation": ({ workspaceName, inviterName, acceptUrl, expiresInHours }) => {
    const heading = `Join ${workspaceName}`;
    const body = [
      paragraph(`${inviterName} invited you to ${workspaceName} on Hexa.`),
      paragraph(`This invitation expires in ${expiresInHours} hours.`),
    ].join("");

    return {
      subject: sanitizeHeader(`You're invited to ${workspaceName}`),
      html: layout({
        preview: `${inviterName} invited you to ${workspaceName}.`,
        heading,
        body,
        cta: { label: "Accept invitation", url: acceptUrl },
        footer: footerFor("workspace.invitation"),
      }),
      text: `${inviterName} invited you to ${workspaceName} on Hexa.\n\nAccept the invitation: ${acceptUrl}\n\nThis invitation expires in ${expiresInHours} hours.\n`,
    };
  },

  "member.role_changed": ({ workspaceName, role, changedByName, workspaceUrl }) => {
    const heading = "Your access changed";
    const body = [
      paragraph(`${changedByName} changed your role to ${role} in ${workspaceName}.`),
      paragraph("Open the workspace to review your current permissions."),
    ].join("");

    return {
      subject: sanitizeHeader(`Your role in ${workspaceName} changed`),
      html: layout({
        preview: `Your role is now ${role}.`,
        heading,
        body,
        cta: { label: "Open workspace", url: workspaceUrl },
        footer: footerFor("member.role_changed"),
      }),
      text: `${changedByName} changed your role to ${role} in ${workspaceName}.\n\nOpen the workspace: ${workspaceUrl}\n`,
    };
  },

  "member.removed": ({ workspaceName, removedByName }) => {
    const heading = "Your access was removed";
    const body = [
      paragraph(`${removedByName} removed you from ${workspaceName}.`),
      paragraph("If this was unexpected, contact the workspace owner."),
    ].join("");

    return {
      subject: sanitizeHeader(`You were removed from ${workspaceName}`),
      html: layout({
        preview: `You no longer have access to ${workspaceName}.`,
        heading,
        body,
        footer: footerFor("member.removed"),
      }),
      text: `${removedByName} removed you from ${workspaceName}.\n\nIf this was unexpected, contact the workspace owner.\n`,
    };
  },

  "password.reset": ({ name, resetUrl, expiresInMinutes }) => {
    const heading = "Reset your password";
    const body = [
      paragraph(`Hi ${name}, use the button below to set a new password.`),
      paragraph(
        `This link expires in ${expiresInMinutes} minutes. If you did not request it, ignore this email.`,
      ),
    ].join("");

    return {
      subject: sanitizeHeader("Reset your Hexa password"),
      html: layout({
        preview: "Set a new password for your account.",
        heading,
        body,
        cta: { label: "Reset password", url: resetUrl },
        footer: footerFor("password.reset"),
      }),
      text: `Hi ${name},\n\nReset your password: ${resetUrl}\n\nThis link expires in ${expiresInMinutes} minutes. If you did not request it, ignore this email.\n`,
    };
  },

  "notification.digest": ({ name, workspaceName, summary, workspaceUrl, preferencesUrl }) => {
    const heading = `What changed in ${workspaceName}`;
    const body = [
      paragraph(`Hi ${name}, here is the latest activity in ${workspaceName}.`),
      `<p style="margin:0 0 14px;font:400 15px/1.65 Arial,Helvetica,sans-serif;color:${BRAND.muted};">${escapeHtml(summary).replace(/\n/g, "<br>")}</p>`,
      `<p style="margin:0;font:13px/1.6 Arial,Helvetica,sans-serif;color:${BRAND.muted};">Manage your email preferences: <a href="${safeUrl(preferencesUrl)}" style="color:${BRAND.brand};">open settings</a></p>`,
    ].join("");

    return {
      subject: sanitizeHeader(`${workspaceName} activity digest`),
      html: layout({
        preview: `Latest activity in ${workspaceName}.`,
        heading,
        body,
        cta: { label: "Open workspace", url: workspaceUrl },
        footer: footerFor("notification.digest"),
      }),
      text: `Hi ${name},\n\nLatest activity in ${workspaceName}:\n${summary}\n\nOpen the workspace: ${workspaceUrl}\nManage email preferences: ${preferencesUrl}\n`,
    };
  },
};

export function renderEmail<K extends EmailEvent>(
  event: K,
  payload: EmailPayloads[K],
): RenderedEmail {
  const renderer = renderers[event] as (value: EmailPayloads[K]) => RenderedEmail;
  return renderer(payload);
}
