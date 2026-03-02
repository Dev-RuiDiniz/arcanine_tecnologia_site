import { hash } from "bcryptjs";

const inputPassword = process.argv[2];

if (!inputPassword) {
  console.error('Usage: npm run auth:hash-password -- "your-password"');
  process.exit(1);
}

const hashedPassword = await hash(inputPassword, 12);
console.log(hashedPassword);
