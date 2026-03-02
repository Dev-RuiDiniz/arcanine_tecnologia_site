"use client";

import { useSession } from "next-auth/react";

import { getRolePermissions } from "@/lib/auth/rbac";

export const AdminSessionStatus = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
        Verificando autenticacao...
      </p>
    );
  }

  if (status === "unauthenticated") {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        Nao autenticado.
      </p>
    );
  }

  const permissions = getRolePermissions(session?.user?.role ?? "VIEWER").join(", ");

  return (
    <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
      Autenticado como {session?.user?.email} ({session?.user?.role}). Permissoes: {permissions}.
    </p>
  );
};
