export default function AccountDisabledPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Acceso desactivado
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Tu usuario no tiene acceso actualmente al sistema. Comunícate con un
          administrador.
        </p>

        <form action="/auth/signout" method="post" className="mt-8">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Volver al inicio de sesión
          </button>
        </form>
      </section>
    </main>
  );
}
