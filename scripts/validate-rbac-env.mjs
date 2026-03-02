const requiredEnvVars = [
  "AUTH_ADMIN_EMAIL",
  "AUTH_ADMIN_PASSWORD_HASH_CURRENT",
  "AUTH_EDITOR_EMAIL",
  "AUTH_EDITOR_PASSWORD_HASH_CURRENT",
  "AUTH_VIEWER_EMAIL",
  "AUTH_VIEWER_PASSWORD_HASH_CURRENT",
];

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error("RBAC env validation failed. Missing:");
  for (const envVar of missingVars) {
    console.error(`- ${envVar}`);
  }
  process.exit(1);
}

console.log("RBAC env validation passed.");
console.log("Configured users by role:");
console.log(`- ADMIN: ${process.env.AUTH_ADMIN_EMAIL}`);
console.log(`- EDITOR: ${process.env.AUTH_EDITOR_EMAIL}`);
console.log(`- VIEWER: ${process.env.AUTH_VIEWER_EMAIL}`);
