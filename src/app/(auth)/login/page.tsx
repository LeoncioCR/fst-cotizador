import { redirect } from "next/navigation";

import { makeGetCurrentUserUseCase } from "@/modules/auth";

import { LoginForm } from "@/modules/auth";

export default async function LoginPage() {
  const currentUser = await makeGetCurrentUserUseCase().execute();

  if (currentUser.success) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          FST Negocios
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Iniciar sesión
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Acceso al sistema interno de cotizaciones.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
