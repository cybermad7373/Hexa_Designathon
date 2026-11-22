import "server-only";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  APP_VERSION: z.string().min(1).default("0.1.0"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://hexa:hexa@localhost:5433/hexa?schema=public"),
  REDIS_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  EMAIL_PROVIDER: z.enum(["console", "smtp", "resend"]).default("console"),
  EMAIL_FROM: z.string().min(3).default("Hexa <no-reply@hexa.local>"),
  SMTP_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(16).optional(),
}).superRefine((value, ctx) => {
  if (value.EMAIL_PROVIDER === "smtp" && !value.SMTP_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["SMTP_URL"],
      message: "SMTP_URL is required when EMAIL_PROVIDER=smtp.",
    });
  }

  if (value.EMAIL_PROVIDER === "resend" && !value.RESEND_API_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["RESEND_API_KEY"],
      message: "RESEND_API_KEY is required when EMAIL_PROVIDER=resend.",
    });
  }
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables. Check .env against .env.example.");
}

export const env = parsed.data;
