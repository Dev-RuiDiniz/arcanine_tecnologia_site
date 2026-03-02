import { readFile } from "node:fs/promises";
import path from "node:path";

const requiredKeys = [
  "DATABASE_URL_DEV",
  "DATABASE_URL_PREVIEW",
  "DATABASE_URL_PROD",
  "LEAD_ATTACHMENT_MAX_SIZE_MB_DEV",
  "LEAD_ATTACHMENT_MAX_SIZE_MB_PREVIEW",
  "LEAD_ATTACHMENT_MAX_SIZE_MB_PROD",
  "AUTH_ADMIN_EMAIL",
  "AUTH_EDITOR_EMAIL",
  "AUTH_VIEWER_EMAIL",
  "SENTRY_DSN",
  "NEXT_PUBLIC_GA_ID",
  "NEXT_PUBLIC_PLAUSIBLE_DOMAIN",
];

const run = async () => {
  const envPath = path.resolve(process.cwd(), ".env.example");
  const content = await readFile(envPath, "utf8");

  const missing = requiredKeys.filter((key) => !content.includes(`${key}=`));
  if (missing.length > 0) {
    throw new Error(`Missing environment keys in .env.example: ${missing.join(", ")}`);
  }

  console.log("Environment matrix validation passed for dev/preview/prod keys.");
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
