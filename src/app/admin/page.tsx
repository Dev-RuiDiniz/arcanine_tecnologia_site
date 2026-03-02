import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AdminSessionStatus } from "@/components/auth/admin-session-status";
import { LogoutButton } from "@/components/auth/logout-button";
import { authOptions } from "@/lib/auth/options";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8">
      <section className="mx-auto max-w-4xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Painel Administrativo</h1>
            <p className="mt-1 text-sm text-zinc-600">Area restrita para gerenciamento interno.</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-6 space-y-4">
          <AdminSessionStatus />
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm text-zinc-700">
              Usuario: <strong>{session.user.email}</strong>
            </p>
            <p className="text-sm text-zinc-700">
              Perfil: <strong>{session.user.role}</strong>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
