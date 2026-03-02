import { readFile } from "node:fs/promises";
import path from "node:path";

const requiredSchemaTokens = [
  "enum PageContentKind",
  "contentKind",
  "schemaVersion",
  "draftContent",
];
const requiredMigrationPath = path.resolve(
  process.cwd(),
  "prisma/migrations/20260302224500_pages_structured_fields/migration.sql",
);

const run = async () => {
  const schemaPath = path.resolve(process.cwd(), "prisma/schema.prisma");
  const schemaFile = await readFile(schemaPath, "utf8");

  for (const token of requiredSchemaTokens) {
    if (!schemaFile.includes(token)) {
      throw new Error(`schema.prisma missing required token: ${token}`);
    }
  }

  const migrationFile = await readFile(requiredMigrationPath, "utf8");
  if (!migrationFile.includes("PageContentKind") || !migrationFile.includes("schemaVersion")) {
    throw new Error("CMS structured migration missing required fields.");
  }

  console.log("CMS schema versioning validation passed.");
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
