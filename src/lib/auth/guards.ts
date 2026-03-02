import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import type { AppPermission, AppRole } from "@/lib/auth/rbac";
import { hasPermission } from "@/lib/auth/rbac";

type SessionAuthResult =
  | {
      ok: true;
      role: AppRole;
    }
  | {
      ok: false;
      error: "Unauthorized" | "Forbidden";
    };

export const requirePermission = async (permission: AppPermission): Promise<SessionAuthResult> => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  const role = session.user.role;
  if (!hasPermission(role, permission)) {
    return { ok: false, error: "Forbidden" };
  }

  return { ok: true, role };
};
