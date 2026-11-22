import "server-only";
import pino from "pino";
import { env } from "./env";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: "hexa-web", version: env.APP_VERSION },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "password",
      "passwordHash",
      "token",
      "secret",
      "apiKey",
      "email",
      "to",
      "toEmail",
      "recipient",
      "resetUrl",
      "acceptUrl",
      "*.email",
      "*.toEmail",
      "*.resetUrl",
      "*.acceptUrl",
    ],
    censor: "[redacted]",
  },
  ...(env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:HH:MM:ss", ignore: "pid,hostname" },
        },
      }
    : {}),
});
