const run = async () => {
  const enabled = process.env.TELEMETRY_ENABLED ?? "true";
  if (!["true", "false"].includes(enabled)) {
    throw new Error("TELEMETRY_ENABLED must be true or false.");
  }

  const pathValue = process.env.TELEMETRY_LOG_PATH || ".telemetry/events.jsonl";
  if (!pathValue.trim()) {
    throw new Error("TELEMETRY_LOG_PATH cannot be empty.");
  }

  console.log(`Telemetry configuration valid. enabled=${enabled} path=${pathValue}`);
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
