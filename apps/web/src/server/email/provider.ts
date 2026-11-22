import "server-only";
import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import type { RenderedEmail } from "./render";

export type OutboundEmail = RenderedEmail & {
  to: string;
  from: string;
};

export interface EmailProvider {
  name: string;
  send(message: OutboundEmail): Promise<{ id: string }>;
}

function createConsoleProvider(): EmailProvider {
  return {
    name: "console",
    async send(message) {
      logger.info(
        { template: message.subject, provider: "console" },
        "email accepted by console provider (set EMAIL_PROVIDER=smtp for Mailpit)",
      );
      return { id: `console_${crypto.randomUUID()}` };
    },
  };
}

function createSmtpProvider(): EmailProvider {
  if (!env.SMTP_URL) {
    throw new Error("SMTP_URL is required when EMAIL_PROVIDER=smtp");
  }

  const transport = nodemailer.createTransport(env.SMTP_URL);

  return {
    name: "smtp",
    async send(message) {
      const info = await transport.sendMail({
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });

      return { id: info.messageId };
    },
  };
}

function createResendProvider(): EmailProvider {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER=resend");
  }

  const apiKey = env.RESEND_API_KEY;

  return {
    name: "resend",
    async send(message) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: message.from,
          to: [message.to],
          subject: message.subject,
          html: message.html,
          text: message.text,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`Resend rejected the email with status ${response.status}`);
      }

      const data = (await response.json()) as { id?: string };
      return { id: data.id ?? "unknown" };
    },
  };
}

const globalForEmail = globalThis as unknown as { emailProvider?: EmailProvider };

export function getEmailProvider(): EmailProvider {
  if (!globalForEmail.emailProvider) {
    globalForEmail.emailProvider =
      env.EMAIL_PROVIDER === "resend"
        ? createResendProvider()
        : env.EMAIL_PROVIDER === "smtp"
          ? createSmtpProvider()
          : createConsoleProvider();
  }

  return globalForEmail.emailProvider;
}
