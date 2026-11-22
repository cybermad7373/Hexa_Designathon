const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const secret = process.env.CRON_SECRET;

if (!secret) {
  console.error("CRON_SECRET is missing. Add it to .env before processing the email queue.");
  process.exit(1);
}

const response = await fetch(`${baseUrl}/api/cron/email`, {
  method: "POST",
  headers: { authorization: `Bearer ${secret}` },
});

const body = await response.text();

if (!response.ok) {
  console.error(`Email queue failed (${response.status}): ${body}`);
  process.exit(1);
}

console.log(body);
