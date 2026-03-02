"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
    >
      Sair
    </button>
  );
};
