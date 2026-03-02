import { readFileSync } from "node:fs";

const filesToValidate = [
  "src/components/public/public-header.tsx",
  "src/components/public/public-footer.tsx",
  "src/app/page.tsx",
];

const requiredTokens = ["sm:", "lg:", "max-w-"];

const failures = [];

for (const filePath of filesToValidate) {
  const content = readFileSync(filePath, "utf-8");
  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      failures.push(`${filePath} missing token: ${token}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Responsive validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Responsive layout validation passed.");
