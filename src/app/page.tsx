export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <section className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-zinc-900">Arcanine Tecnologia</h1>
        <p className="mt-3 text-zinc-600">
          Base do projeto inicializada. A autenticacao do painel administrativo foi implementada na
          Sprint 3.
        </p>
        <a
          href="/admin/login"
          className="mt-6 inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Acessar login do admin
        </a>
      </section>
    </main>
  );
}
