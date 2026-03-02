import { compare } from "bcryptjs";

export const verifyPasswordAgainstHashes = async (
  plainPassword: string,
  currentHash?: string,
  nextHash?: string,
) => {
  const hashes = [currentHash, nextHash].filter(Boolean) as string[];
  if (hashes.length === 0) {
    return false;
  }

  for (const hash of hashes) {
    const isValid = await compare(plainPassword, hash);
    if (isValid) {
      return true;
    }
  }

  return false;
};
