import type { AppRole } from "@/lib/auth/rbac";

type EnvAuthUser = {
  id: string;
  role: AppRole;
  email?: string;
  name: string;
  passwordHashCurrent?: string;
  passwordHashNext?: string;
};

export type AuthUserConfig = {
  id: string;
  role: AppRole;
  email: string;
  name: string;
  passwordHashCurrent?: string;
  passwordHashNext?: string;
};

const fromEnv = (user: EnvAuthUser): AuthUserConfig | null => {
  if (!user.email) {
    return null;
  }

  return {
    id: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    passwordHashCurrent: user.passwordHashCurrent,
    passwordHashNext: user.passwordHashNext,
  };
};

export const getAuthUsersFromEnv = (): AuthUserConfig[] => {
  const envUsers: EnvAuthUser[] = [
    {
      id: "admin",
      role: "ADMIN",
      email: process.env.AUTH_ADMIN_EMAIL,
      name: "Arcanine Admin",
      passwordHashCurrent: process.env.AUTH_ADMIN_PASSWORD_HASH_CURRENT,
      passwordHashNext: process.env.AUTH_ADMIN_PASSWORD_HASH_NEXT,
    },
    {
      id: "editor",
      role: "EDITOR",
      email: process.env.AUTH_EDITOR_EMAIL,
      name: "Arcanine Editor",
      passwordHashCurrent: process.env.AUTH_EDITOR_PASSWORD_HASH_CURRENT,
      passwordHashNext: process.env.AUTH_EDITOR_PASSWORD_HASH_NEXT,
    },
    {
      id: "viewer",
      role: "VIEWER",
      email: process.env.AUTH_VIEWER_EMAIL,
      name: "Arcanine Viewer",
      passwordHashCurrent: process.env.AUTH_VIEWER_PASSWORD_HASH_CURRENT,
      passwordHashNext: process.env.AUTH_VIEWER_PASSWORD_HASH_NEXT,
    },
  ];

  return envUsers.map(fromEnv).filter((user): user is AuthUserConfig => user !== null);
};
