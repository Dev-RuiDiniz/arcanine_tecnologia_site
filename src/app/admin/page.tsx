import { getServerSession } from "next-auth";

import { AdminSessionStatus } from "@/components/auth/admin-session-status";
import { authOptions } from "@/lib/auth/options";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }

  return (
    <section className="space-y-4">
      <AdminSessionStatus />
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-sm text-zinc-700">
          Usuario: <strong>{session.user.email}</strong>
        </p>
        <p className="text-sm text-zinc-700">
          Perfil: <strong>{session.user.role}</strong>
        </p>
      </div>
    </section>
  );
}
