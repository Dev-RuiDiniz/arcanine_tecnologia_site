const requiredVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "LEAD_INTERNAL_NOTIFICATION_EMAIL",
];

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const run = async () => {
  const missing = requiredVars.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing SMTP config vars: ${missing.join(", ")}`);
  }

  const port = Number.parseInt(process.env.SMTP_PORT || "", 10);
  if (!Number.isFinite(port) || port <= 0 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid TCP port number.");
  }

  if (!["true", "false"].includes(process.env.SMTP_SECURE || "false")) {
    throw new Error("SMTP_SECURE must be true or false.");
  }

  if (!isEmail(process.env.SMTP_FROM || "")) {
    throw new Error("SMTP_FROM must be a valid e-mail address.");
  }

  if (!isEmail(process.env.LEAD_INTERNAL_NOTIFICATION_EMAIL || "")) {
    throw new Error("LEAD_INTERNAL_NOTIFICATION_EMAIL must be a valid e-mail address.");
  }

  console.log("SMTP/transacional configuration validation passed.");
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
